import { Router } from 'express';
import type { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../db/prisma.js';
import { qstr } from '../lib/queryHelpers.js';

const router = Router();

// Create a new interview invite
router.post('/invites', async (req: Request, res: Response) => {
  try {
    const { candidateName, candidateEmail, roleName, roleLevel, jobDescription, activeGates, interviewMode } = req.body;

    if (!candidateName || !roleName || !roleLevel) {
      return res.status(400).json({ error: 'candidateName, roleName, and roleLevel are required' });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await prisma.interviewInvite.create({
      data: {
        token,
        candidateName,
        candidateEmail: candidateEmail || null,
        roleName,
        roleLevel,
        jobDescription: jobDescription || null,
        activeGates: activeGates || [],
        interviewMode: interviewMode || 'active',
        organizationId: (req as any).user?.organizationId || null,
        expiresAt,
      },
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const inviteUrl = `${baseUrl}/invite/${token}`;

    return res.status(201).json({ ...invite, inviteUrl });
  } catch (error) {
    console.error('Create invite error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// List all invites
router.get('/invites', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).user?.organizationId;
    const invites = await prisma.interviewInvite.findMany({
      where: orgId ? { organizationId: orgId } : {},
      orderBy: { createdAt: 'desc' },
    });
    return res.json(invites);
  } catch (error) {
    console.error('List invites error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an invite
router.delete('/invites/:id', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).user?.organizationId;
    // Verify org ownership before deleting
    const invite = await prisma.interviewInvite.findUnique({ where: { id: qstr(req.params.id)! } });
    if (!invite) return res.status(404).json({ error: 'Invite not found' });
    if (orgId && invite.organizationId !== orgId) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    await prisma.interviewInvite.delete({ where: { id: invite.id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete invite error:', error);
    if ((error as any).code === 'P2025') return res.status(404).json({ error: 'Invite not found' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
