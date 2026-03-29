import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { signToken } from '../middleware/auth.js';
import { qstr } from '../lib/queryHelpers.js';

const IS_PROD = process.env.NODE_ENV === 'production';
const CANDIDATE_COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: (IS_PROD ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 4 * 60 * 60 * 1000, // 4-hour ephemeral session for candidate
  path: '/',
};

const router = Router();

// Get invite details by token (public, no auth)
router.get('/public/invite/:token', async (req: Request, res: Response) => {
  try {
    const invite = await prisma.interviewInvite.findUnique({
      where: { token: qstr(req.params.token)! },
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(410).json({ error: 'This invite has expired' });
    }

    if (invite.status === 'started' || invite.status === 'completed') {
      return res.status(409).json({ error: 'This invite has already been used', status: invite.status });
    }

    return res.json({
      id: invite.id,
      candidateName: invite.candidateName,
      candidateEmail: invite.candidateEmail,
      roleName: invite.roleName,
      roleLevel: invite.roleLevel,
      jobDescription: invite.jobDescription,
      activeGates: invite.activeGates,
      interviewMode: invite.interviewMode,
      status: invite.status,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    console.error('Get public invite error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start interview from invite (public, no auth)
router.post('/public/invite/:token/start', async (req: Request, res: Response) => {
  try {
    const { candidateName } = req.body;

    const invite = await prisma.interviewInvite.findUnique({
      where: { token: qstr(req.params.token)! },
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(410).json({ error: 'This invite has expired' });
    }

    if (invite.status === 'started' || invite.status === 'completed') {
      return res.status(409).json({ error: 'This invite has already been used', status: invite.status });
    }

    // Create interview session from invite data
    const setup = {
      candidateName: candidateName || invite.candidateName,
      roleName: invite.roleName,
      roleLevel: invite.roleLevel,
      jobDescription: invite.jobDescription || '',
      cvSummary: '',
      interviewMode: invite.interviewMode,
      activeGates: invite.activeGates,
    };

    const session = await prisma.interviewSession.create({
      data: {
        setup,
        status: 'preparing',
        voiceProvider: 'gemini',
      },
    });

    // Update invite status
    await prisma.interviewInvite.update({
      where: { id: invite.id },
      data: { status: 'started', sessionId: session.id },
    });

    // Issue an ephemeral JWT for the candidate so they can call authenticated
    // endpoints (voice session, transcript saves, assessment stream) during
    // the interview without needing a real user account.
    const candidateUser = {
      id: `candidate_${session.id}`,
      email: '',
      name: (candidateName || invite.candidateName || 'Candidate').trim(),
      role: 'candidate',
    };
    const candidateToken = signToken(candidateUser);
    res.cookie('assay_token', candidateToken, CANDIDATE_COOKIE_OPTS);

    return res.status(201).json({
      session,
      candidateUser,
    });
  } catch (error) {
    console.error('Start invite interview error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
