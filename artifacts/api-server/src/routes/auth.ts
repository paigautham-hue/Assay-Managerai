import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../db/prisma.js';
import { signToken, authenticate, type AuthUser } from '../middleware/auth.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const ALLOWED_ROLES = ['owner', 'admin', 'interviewer', 'viewer'];

function userToPayload(user: { id: string; email: string; name: string; role: string; organizationId: string | null }): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId || undefined,
  };
}

async function logActivity(action: string, details: Record<string, unknown>, actorId?: string, userId?: string) {
  try {
    await prisma.activityLog.create({ data: { action, details, actorId: actorId ?? null, userId: userId ?? null } });
  } catch { /* non-critical */ }
}

async function touchLastActive(userId: string) {
  try {
    await prisma.user.update({ where: { id: userId }, data: { lastActiveAt: new Date() } });
  } catch { /* non-critical */ }
}

// ── Register ──────────────────────────────────────────────────────────────────

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password, inviteToken } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'email, name, and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const isFirstUser = (await prisma.user.count()) === 0;
    let assignedRole = isFirstUser ? 'owner' : 'viewer';

    if (inviteToken) {
      const invite = await prisma.invitation.findUnique({ where: { token: inviteToken } });
      if (invite && !invite.acceptedAt && invite.expiresAt > new Date() && invite.email === email) {
        assignedRole = invite.role;
        await prisma.invitation.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, name, passwordHash, role: assignedRole } });

    await logActivity('user.registered', { email, role: assignedRole }, user.id, user.id);

    const payload = userToPayload(user);
    const token = signToken(payload);
    res.cookie('assay_token', token, COOKIE_OPTS);
    return res.status(201).json({ user: { ...payload, hasPassword: true } });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'suspended') return res.status(403).json({ error: 'Account suspended. Contact your administrator.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    await touchLastActive(user.id);
    await logActivity('user.login', { email }, user.id, user.id);

    const payload = userToPayload(user);
    const token = signToken(payload);
    res.cookie('assay_token', token, COOKIE_OPTS);
    return res.json({ user: { ...payload, hasPassword: true } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Logout ────────────────────────────────────────────────────────────────────

router.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('assay_token', { path: '/' });
  return res.json({ success: true });
});

// ── Me ────────────────────────────────────────────────────────────────────────

router.get('/auth/me', authenticate, async (req: Request, res: Response) => {
  await touchLastActive(req.user!.id);
  const dbUser = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { passwordHash: true } });
  return res.json({ user: { ...req.user, hasPassword: !!dbUser?.passwordHash } });
});

// ── Providers ─────────────────────────────────────────────────────────────────

router.get('/auth/providers', (_req: Request, res: Response) => {
  return res.json({ google: !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET), password: true });
});

// ── Google OAuth ──────────────────────────────────────────────────────────────

router.get('/auth/google', (_req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID) return res.redirect(`${APP_URL}/login?error=google_not_configured`);
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${APP_URL}/api/auth/google/callback`);
  const url = client.generateAuthUrl({ access_type: 'offline', scope: ['openid', 'email', 'profile'], prompt: 'select_account' });
  return res.redirect(url);
});

router.get('/auth/google/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;
  if (error || !code) return res.redirect(`${APP_URL}/login?error=google_denied`);
  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${APP_URL}/api/auth/google/callback`);
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token!, audience: GOOGLE_CLIENT_ID });
    const gPayload = ticket.getPayload();
    if (!gPayload?.email) return res.redirect(`${APP_URL}/login?error=google_failed`);

    const { sub: googleId, email, name = email } = gPayload;
    let user = await prisma.user.findFirst({ where: { OR: [{ googleId }, { email }] } });
    if (user) {
      if (!user.googleId) await prisma.user.update({ where: { id: user.id }, data: { googleId } });
    } else {
      const isFirstUser = (await prisma.user.count()) === 0;
      user = await prisma.user.create({ data: { email, name: name || email, googleId, role: isFirstUser ? 'owner' : 'viewer' } });
    }

    if (user.status === 'suspended') return res.redirect(`${APP_URL}/login?error=suspended`);

    await touchLastActive(user.id);
    await logActivity('user.login', { method: 'google', email }, user.id, user.id);

    const userPayload = userToPayload(user);
    const token = signToken(userPayload);
    res.cookie('assay_token', token, COOKIE_OPTS);
    return res.redirect(APP_URL);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return res.redirect(`${APP_URL}/login?error=google_failed`);
  }
});

// ── List Users ────────────────────────────────────────────────────────────────

router.get('/auth/users', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) return res.status(403).json({ error: 'Access denied' });
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, name: true, role: true, status: true, organizationId: true, createdAt: true, lastActiveAt: true, googleId: true, passwordHash: true },
  });
  return res.json(users.map(u => ({ ...u, hasPassword: !!u.passwordHash, passwordHash: undefined })));
});

// ── Update User (role, name, status) ─────────────────────────────────────────

router.patch('/auth/users/:id', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) return res.status(403).json({ error: 'Access denied' });

  const { role, name, status } = req.body;
  if (role && !ALLOWED_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) return res.status(404).json({ error: 'User not found' });

  if (req.user!.role !== 'owner' && target.role === 'owner') return res.status(403).json({ error: 'Cannot modify owner' });
  if (req.params.id === req.user!.id && role && role !== req.user!.role) return res.status(400).json({ error: 'Cannot change your own role' });

  const updates: Record<string, unknown> = {};
  if (role) updates.role = role;
  if (name) updates.name = name;
  if (status && ['active', 'suspended'].includes(status)) updates.status = status;

  const updated = await prisma.user.update({ where: { id: req.params.id }, data: updates, select: { id: true, email: true, name: true, role: true, status: true, organizationId: true, createdAt: true, lastActiveAt: true, passwordHash: true } });

  await logActivity('user.updated', { changes: updates, targetEmail: target.email }, req.user!.id, target.id);
  return res.json({ ...updated, hasPassword: !!updated.passwordHash, passwordHash: undefined });
});

// ── Delete User ───────────────────────────────────────────────────────────────

router.delete('/auth/users/:id', authenticate, async (req: Request, res: Response) => {
  if (req.user!.role !== 'owner') return res.status(403).json({ error: 'Only owners can delete users' });
  if (req.params.id === req.user!.id) return res.status(400).json({ error: 'Cannot delete yourself' });

  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (target.role === 'owner') return res.status(400).json({ error: 'Cannot delete another owner' });

  await prisma.user.delete({ where: { id: req.params.id } });
  await logActivity('user.deleted', { deletedEmail: target.email }, req.user!.id);
  return res.json({ success: true });
});

// ── Invitations ───────────────────────────────────────────────────────────────

router.get('/auth/invitations', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) return res.status(403).json({ error: 'Access denied' });
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: 'desc' },
    include: { invitedBy: { select: { id: true, name: true, email: true } } },
  });
  return res.json(invitations);
});

router.post('/auth/invitations', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) return res.status(403).json({ error: 'Access denied' });

  const { email, role = 'interviewer' } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!ALLOWED_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid role' });
  if (role === 'owner' && req.user!.role !== 'owner') return res.status(403).json({ error: 'Only owners can invite owners' });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(409).json({ error: 'User already exists with this email' });

  const existing = await prisma.invitation.findFirst({ where: { email, acceptedAt: null, expiresAt: { gt: new Date() } } });
  if (existing) return res.status(409).json({ error: 'A pending invitation already exists for this email' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await prisma.invitation.create({
    data: { email, role, token, invitedById: req.user!.id, expiresAt },
    include: { invitedBy: { select: { id: true, name: true, email: true } } },
  });

  await logActivity('invitation.created', { email, role }, req.user!.id);

  const inviteUrl = `${APP_URL}/accept-invite?token=${token}`;
  return res.status(201).json({ ...invitation, inviteUrl });
});

router.delete('/auth/invitations/:id', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) return res.status(403).json({ error: 'Access denied' });

  const invitation = await prisma.invitation.findUnique({ where: { id: req.params.id } });
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });

  await prisma.invitation.delete({ where: { id: req.params.id } });
  await logActivity('invitation.cancelled', { email: invitation.email }, req.user!.id);
  return res.json({ success: true });
});

router.get('/auth/accept-invite/:token', async (req: Request, res: Response) => {
  const invitation = await prisma.invitation.findUnique({ where: { token: req.params.token } });
  if (!invitation) return res.status(404).json({ error: 'Invitation not found or already used' });
  if (invitation.acceptedAt) return res.status(410).json({ error: 'Invitation already accepted' });
  if (invitation.expiresAt < new Date()) return res.status(410).json({ error: 'Invitation has expired' });
  return res.json({ email: invitation.email, role: invitation.role, expiresAt: invitation.expiresAt });
});

// ── Activity Log ──────────────────────────────────────────────────────────────

router.get('/auth/activity', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) return res.status(403).json({ error: 'Access denied' });

  const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
  const userId = req.query.userId as string | undefined;

  const logs = await prisma.activityLog.findMany({
    where: userId ? { OR: [{ userId }, { actorId: userId }] } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const actorIds = [...new Set(logs.map(l => l.actorId).filter(Boolean))] as string[];
  const actors = actorIds.length
    ? await prisma.user.findMany({ where: { id: { in: actorIds } }, select: { id: true, name: true, email: true } })
    : [];
  const actorMap = Object.fromEntries(actors.map(a => [a.id, a]));

  return res.json(logs.map(l => ({ ...l, actor: l.actorId ? actorMap[l.actorId] : null })));
});

// ── Organization ──────────────────────────────────────────────────────────────

router.get('/auth/organization', authenticate, async (req: Request, res: Response) => {
  if (!req.user!.organizationId) {
    const userCount = await prisma.user.count();
    return res.json({ id: null, name: 'My Team', userCount, settings: {} });
  }
  const org = await prisma.organization.findUnique({
    where: { id: req.user!.organizationId },
    include: { _count: { select: { users: true } } },
  });
  if (!org) return res.status(404).json({ error: 'Organization not found' });
  return res.json({ ...org, userCount: org._count.users });
});

router.patch('/auth/organization', authenticate, async (req: Request, res: Response) => {
  if (req.user!.role !== 'owner') return res.status(403).json({ error: 'Only owners can update organization settings' });

  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return res.status(400).json({ error: 'Organization name is required' });
  }

  if (!req.user!.organizationId) {
    const org = await prisma.organization.create({ data: { name: name.trim() } });
    await prisma.user.update({ where: { id: req.user!.id }, data: { organizationId: org.id } });
    await logActivity('organization.updated', { name: name.trim() }, req.user!.id);
    return res.json(org);
  }

  const org = await prisma.organization.update({
    where: { id: req.user!.organizationId },
    data: { name: name.trim() },
  });
  await logActivity('organization.updated', { name: name.trim() }, req.user!.id);
  return res.json(org);
});

export default router;
