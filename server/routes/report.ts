import { Router } from 'express';
import type { Request, Response } from 'express';
import { buildReport } from '../lib/reportBuilder.js';

const router = Router();

router.post('/report', async (req: Request, res: Response) => {
  try {
    const { sessionId, candidateName, roleName, assessorVerdicts, chairmanSynthesis, transcript, setup } = req.body;

    if (!sessionId || !candidateName || !roleName) {
      return res.status(400).json({ error: 'sessionId, candidateName, and roleName are required' });
    }

    if (!assessorVerdicts || !Array.isArray(assessorVerdicts) || assessorVerdicts.length === 0) {
      return res.status(400).json({ error: 'assessorVerdicts array is required and must not be empty' });
    }

    if (!chairmanSynthesis) {
      return res.status(400).json({ error: 'chairmanSynthesis is required' });
    }

    const report = buildReport({
      sessionId,
      candidateName,
      roleName,
      assessorVerdicts,
      chairmanSynthesis,
      setup,
    });

    return res.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

export default router;
