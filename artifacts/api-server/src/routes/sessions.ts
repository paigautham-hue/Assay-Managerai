import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';

const router = Router();

router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const { id, setup, status, voiceProvider, organizationId } = req.body;

    if (!setup) return res.status(400).json({ error: 'setup is required' });

    const session = await prisma.interviewSession.create({
      data: {
        id: id || undefined,
        setup,
        status: status || 'preparing',
        voiceProvider: voiceProvider || 'gemini',
        organizationId: organizationId || null,
      },
    });

    return res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

router.get('/sessions', async (req: Request, res: Response) => {
  try {
    // Candidate-role users can only see their own session.
    // Their user.id is formatted as `candidate_<sessionId>`.
    if (req.user?.role === 'candidate') {
      const candidateSessionId = req.user.id.replace(/^candidate_/, '');
      const session = await prisma.interviewSession.findUnique({
        where: { id: candidateSessionId },
        include: {
          reports: { select: { id: true, candidateName: true, roleName: true, createdAt: true, reportData: true } },
          _count: { select: { transcripts: true, observations: true } },
        },
      });
      return res.json(session ? [session] : []);
    }

    // TODO: InterviewSession has no userId field — ownership filtering by user
    // is not possible with the current schema. Sessions are scoped to
    // organizationId at best. Add a userId/createdById column to
    // InterviewSession to enable proper per-user filtering.
    const where: Record<string, unknown> = {};
    if (req.user?.organizationId) {
      where.organizationId = req.user.organizationId;
    }

    const sessions = await prisma.interviewSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reports: { select: { id: true, candidateName: true, roleName: true, createdAt: true, reportData: true } },
        _count: { select: { transcripts: true, observations: true } },
      },
    });
    return res.json(sessions);
  } catch (error) {
    console.error('List sessions error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const session = await prisma.interviewSession.findUnique({
      where: { id: req.params.id },
      include: {
        transcripts: { orderBy: { timestamp: 'asc' } },
        observations: { orderBy: { timestamp: 'asc' } },
        verdicts: true,
        reports: true,
      },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    return res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { status, startedAt, endedAt } = req.body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (startedAt) data.startedAt = new Date(startedAt);
    if (endedAt) data.endedAt = new Date(endedAt);

    const session = await prisma.interviewSession.update({
      where: { id: req.params.id },
      data,
    });
    return res.json(session);
  } catch (error) {
    console.error('Update session error:', error);
    if ((error as any).code === 'P2025') return res.status(404).json({ error: 'Session not found' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sessions/:id/transcript', async (req: Request, res: Response) => {
  try {
    const { id, speaker, text, timestamp, audioTimestamp } = req.body;

    if (!speaker || !text || !timestamp) {
      return res.status(400).json({ error: 'speaker, text, and timestamp are required' });
    }

    const entry = await prisma.transcriptEntry.create({
      data: {
        id: id || undefined,
        sessionId: req.params.id,
        speaker,
        text,
        timestamp: new Date(timestamp),
        audioTimestamp: audioTimestamp ?? null,
      },
    });
    return res.status(201).json(entry);
  } catch (error) {
    console.error('Add transcript error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sessions/:id/transcript/bulk', async (req: Request, res: Response) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries)) return res.status(400).json({ error: 'entries array required' });

    const created = await prisma.transcriptEntry.createMany({
      data: entries.map((e: any) => ({
        id: e.id || undefined,
        sessionId: req.params.id,
        speaker: e.speaker,
        text: e.text,
        timestamp: new Date(e.timestamp),
        audioTimestamp: e.audioTimestamp ?? null,
      })),
      skipDuplicates: true,
    });
    return res.status(201).json({ count: created.count });
  } catch (error) {
    console.error('Bulk transcript error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sessions/:id/observations', async (req: Request, res: Response) => {
  try {
    const { id, type, dimension, gate, description, evidence, confidence, timestamp } = req.body;

    if (!type || !description || !timestamp) {
      return res.status(400).json({ error: 'type, description, and timestamp are required' });
    }

    const obs = await prisma.observation.create({
      data: {
        id: id || undefined,
        sessionId: req.params.id,
        type,
        dimension: dimension ?? null,
        gate: gate ?? null,
        description,
        evidence: evidence ?? '',
        confidence: confidence ?? 0.5,
        timestamp: new Date(timestamp),
      },
    });
    return res.status(201).json(obs);
  } catch (error) {
    console.error('Add observation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sessions/:id/verdicts', async (req: Request, res: Response) => {
  try {
    const { role, recommendation, confidence, narrative, dimensionScores, deepSignalScores, psychologicalScreening, gateEvaluations, keyInsights, dissent } = req.body;

    if (!role || !recommendation || !narrative) {
      return res.status(400).json({ error: 'role, recommendation, and narrative are required' });
    }

    const verdict = await prisma.assessorVerdict.create({
      data: {
        sessionId: req.params.id,
        role,
        recommendation,
        confidence: confidence ?? 0.5,
        narrative,
        dimensionScores: dimensionScores ?? [],
        deepSignalScores: deepSignalScores ?? null,
        psychologicalScreening: psychologicalScreening ?? null,
        gateEvaluations: gateEvaluations ?? [],
        keyInsights: keyInsights ?? [],
        dissent: dissent ?? null,
      },
    });
    return res.status(201).json(verdict);
  } catch (error) {
    console.error('Add verdict error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
