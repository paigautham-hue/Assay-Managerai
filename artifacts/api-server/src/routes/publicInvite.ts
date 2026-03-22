import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';

const router = Router();

// Get invite details by token (public, no auth)
router.get('/public/invite/:token', async (req: Request, res: Response) => {
  try {
    const invite = await prisma.interviewInvite.findUnique({
      where: { token: req.params.token },
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
      where: { token: req.params.token },
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
        voiceProvider: 'openai',
      },
    });

    // Update invite status
    await prisma.interviewInvite.update({
      where: { id: invite.id },
      data: { status: 'started', sessionId: session.id },
    });

    // Create OpenAI Realtime session for WebRTC
    let clientSecret = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-realtime',
            modalities: ['text', 'audio'],
            instructions: `You are conducting an executive interview for the role of ${setup.roleName} (${setup.roleLevel}).`,
            voice: 'coral',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 500,
              silence_duration_ms: 800,
              eagerness: 'medium',
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          clientSecret = data.client_secret?.value || data.client_secret;
        }
      } catch (err) {
        console.warn('Failed to create OpenAI realtime session:', err);
      }
    }

    return res.status(201).json({
      session,
      clientSecret,
    });
  } catch (error) {
    console.error('Start invite interview error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
