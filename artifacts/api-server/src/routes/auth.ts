import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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

function userToPayload(user: { id: string; email: string; name: string; role: string; organizationId: string | null }): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId || undefined,
  };
}

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password, role = 'interviewer' } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'email, name, and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const allowed = ['owner', 'admin', 'interviewer', 'viewer'];
    if (!allowed.includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const isFirstUser = (await prisma.user.count()) === 0;
    const assignedRole = isFirstUser ? 'owner' : role;

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, passwordHash, role: assignedRole },
    });

    const payload = userToPayload(user);
    const token = signToken(payload);
    res.cookie('assay_token', token, COOKIE_OPTS);
    return res.status(201).json({ user: { ...payload, hasPassword: true } });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = userToPayload(user);
    const token = signToken(payload);
    res.cookie('assay_token', token, COOKIE_OPTS);
    return res.json({ user: { ...payload, hasPassword: true } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('assay_token', { path: '/' });
  return res.json({ success: true });
});

router.get('/auth/me', authenticate, (req: Request, res: Response) => {
  return res.json({ user: { ...req.user, hasPassword: true } });
});

router.get('/auth/google', (_req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: 'Google OAuth not configured' });
  }
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${APP_URL}/api/auth/google/callback`);
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'select_account',
  });
  return res.redirect(url);
});

router.get('/auth/google/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;
  if (error || !code) {
    return res.redirect(`${APP_URL}/login?error=google_denied`);
  }
  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${APP_URL}/api/auth/google/callback`);
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.redirect(`${APP_URL}/login?error=google_failed`);

    const { sub: googleId, email, name = email } = payload;

    let user = await prisma.user.findFirst({ where: { OR: [{ googleId }, { email }] } });
    if (user) {
      if (!user.googleId) await prisma.user.update({ where: { id: user.id }, data: { googleId } });
    } else {
      const isFirstUser = (await prisma.user.count()) === 0;
      user = await prisma.user.create({
        data: { email, name: name || email, googleId, role: isFirstUser ? 'owner' : 'viewer' },
      });
    }

    const userPayload = userToPayload(user);
    const token = signToken(userPayload);
    res.cookie('assay_token', token, COOKIE_OPTS);
    return res.redirect(APP_URL);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return res.redirect(`${APP_URL}/login?error=google_failed`);
  }
});

router.get('/auth/users', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, name: true, role: true, organizationId: true, createdAt: true, googleId: true, passwordHash: true },
  });
  return res.json(users.map(u => ({ ...u, hasPassword: !!u.passwordHash, passwordHash: undefined })));
});

router.patch('/auth/users/:id', authenticate, async (req: Request, res: Response) => {
  if (!['owner', 'admin'].includes(req.user!.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { role, name } = req.body;
  const allowed = ['owner', 'admin', 'interviewer', 'viewer'];
  if (role && !allowed.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { ...(role && { role }), ...(name && { name }) },
    select: { id: true, email: true, name: true, role: true, organizationId: true, createdAt: true },
  });
  return res.json({ ...updated, hasPassword: true });
});

export default router;
