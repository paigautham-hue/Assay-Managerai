import { Router, json } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { qstr } from '../lib/queryHelpers.js';

const router = Router();

// Audio uploads can be large (base64-encoded webm). Increase limit for audio routes only.
const largeJsonParser = json({ limit: '100mb' });

/**
 * POST /sessions/:id/audio
 * Accept base64-encoded audio blob and store it in the DB audioData field.
 * Body: { audio: "<base64 string>" }
 */
router.post('/sessions/:id/audio', largeJsonParser, async (req: Request, res: Response) => {
  try {
    const { audio } = req.body;

    if (!audio || typeof audio !== 'string') {
      return res.status(400).json({ error: 'audio (base64 string) is required' });
    }

    // Convert base64 to Buffer for Prisma Bytes field
    const audioBuffer = Buffer.from(audio, 'base64');

    const session = await prisma.interviewSession.update({
      where: { id: qstr(req.params.id)! },
      data: { audioData: audioBuffer },
      select: { id: true },
    });

    return res.json({ success: true, sessionId: session.id, size: audioBuffer.length });
  } catch (error) {
    console.error('Upload audio error:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Session not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /sessions/:id/audio
 * Stream the audio data back as audio/webm.
 */
router.get('/sessions/:id/audio', async (req: Request, res: Response) => {
  try {
    const session = await prisma.interviewSession.findUnique({
      where: { id: qstr(req.params.id)! },
      select: { audioData: true },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.audioData) {
      return res.status(404).json({ error: 'No audio data for this session' });
    }

    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Content-Length', session.audioData.length);
    res.setHeader('Accept-Ranges', 'bytes');
    return res.send(session.audioData);
  } catch (error) {
    console.error('Get audio error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * HEAD /sessions/:id/audio
 * Check if audio exists for a session (used by the client to show/hide replay).
 */
router.head('/sessions/:id/audio', async (req: Request, res: Response) => {
  try {
    // Use raw query to check existence + get length without loading the whole blob
    const result = await prisma.$queryRaw<{ len: number }[]>`
      SELECT octet_length(audio_data) as len
      FROM interview_sessions
      WHERE id = ${qstr(req.params.id)!} AND audio_data IS NOT NULL
      LIMIT 1
    `;

    if (!result.length) {
      return res.status(404).end();
    }

    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Content-Length', Number(result[0].len));
    return res.status(200).end();
  } catch (error) {
    console.error('Head audio error:', error);
    return res.status(500).end();
  }
});

export default router;
