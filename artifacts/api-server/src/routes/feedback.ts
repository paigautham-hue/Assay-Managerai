import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';

const router = Router();

/**
 * POST /feedback
 * Submit feedback on a report's accuracy (self-learning loop).
 * Only authenticated users who have viewed the report can submit feedback.
 */
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const { reportId, overallAccuracy, hireOutcome, performanceNote, dimensionFeedback, gateFeedback, comments } = req.body;

    if (!reportId || !overallAccuracy) {
      return res.status(400).json({ error: 'reportId and overallAccuracy are required' });
    }

    if (overallAccuracy < 1 || overallAccuracy > 5) {
      return res.status(400).json({ error: 'overallAccuracy must be between 1 and 5' });
    }

    const feedback = await prisma.reportFeedback.upsert({
      where: { reportId_userId: { reportId, userId } },
      create: {
        reportId,
        userId,
        overallAccuracy,
        hireOutcome,
        performanceNote,
        dimensionFeedback: dimensionFeedback || undefined,
        gateFeedback: gateFeedback || undefined,
        comments,
      },
      update: {
        overallAccuracy,
        hireOutcome,
        performanceNote,
        dimensionFeedback: dimensionFeedback || undefined,
        gateFeedback: gateFeedback || undefined,
        comments,
      },
    });

    return res.json(feedback);
  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

/**
 * GET /feedback/:reportId
 * Get feedback for a specific report.
 */
router.get('/feedback/:reportId', async (req: Request, res: Response) => {
  try {
    const feedback = await prisma.reportFeedback.findMany({
      where: { reportId: req.params.reportId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(feedback);
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

/**
 * GET /feedback/analytics/accuracy
 * Get aggregate accuracy metrics across all feedback (admin only).
 * This powers the self-learning dashboard.
 */
router.get('/feedback/analytics/accuracy', async (req: Request, res: Response) => {
  try {
    if (!req.user || !['owner', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const feedback = await prisma.reportFeedback.findMany({
      select: {
        overallAccuracy: true,
        hireOutcome: true,
        dimensionFeedback: true,
        gateFeedback: true,
        createdAt: true,
      },
    });

    const totalFeedback = feedback.length;
    const avgAccuracy = totalFeedback > 0
      ? feedback.reduce((sum, f) => sum + f.overallAccuracy, 0) / totalFeedback
      : 0;

    const outcomeDistribution: Record<string, number> = {};
    for (const f of feedback) {
      if (f.hireOutcome) {
        outcomeDistribution[f.hireOutcome] = (outcomeDistribution[f.hireOutcome] || 0) + 1;
      }
    }

    return res.json({
      totalFeedback,
      avgAccuracy: Math.round(avgAccuracy * 100) / 100,
      outcomeDistribution,
      recentTrend: feedback.slice(0, 20).map(f => ({
        accuracy: f.overallAccuracy,
        date: f.createdAt,
      })),
    });
  } catch (error) {
    console.error('Feedback analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
