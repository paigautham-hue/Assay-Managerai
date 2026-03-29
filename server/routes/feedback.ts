import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { qstr } from '../lib/queryHelpers.js';

const router = Router();

const VALID_OUTCOMES = ['hired', 'rejected', 'withdrew', 'pending'];

/**
 * POST /feedback
 * Submit feedback on a report's accuracy (self-learning loop).
 */
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const userIdStr = req.user?.id;
    if (!userIdStr) return res.status(401).json({ error: 'Authentication required' });
    const userId = parseInt(userIdStr);

    const { reportId, overallAccuracy, hireOutcome, performanceNote, dimensionFeedback, gateFeedback, comments } = req.body;

    if (!reportId || overallAccuracy === undefined || overallAccuracy === null) {
      return res.status(400).json({ error: 'reportId and overallAccuracy are required' });
    }

    const accuracy = Math.round(Number(overallAccuracy));
    if (isNaN(accuracy) || accuracy < 1 || accuracy > 5) {
      return res.status(400).json({ error: 'overallAccuracy must be an integer between 1 and 5' });
    }

    if (hireOutcome && !VALID_OUTCOMES.includes(hireOutcome)) {
      return res.status(400).json({ error: `hireOutcome must be one of: ${VALID_OUTCOMES.join(', ')}` });
    }

    // Verify report exists and belongs to user's org
    const orgId = req.user?.organizationId;
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { session: { select: { organizationId: true } } },
    });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    if (orgId && report.session?.organizationId !== orgId) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const feedback = await prisma.reportFeedback.upsert({
      where: { reportId_userId: { reportId, userId: userId } },
      create: {
        reportId,
        userId,
        overallAccuracy: accuracy,
        hireOutcome: hireOutcome || undefined,
        performanceNote: performanceNote || undefined,
        dimensionFeedback: dimensionFeedback || undefined,
        gateFeedback: gateFeedback || undefined,
        comments: comments || undefined,
      },
      update: {
        overallAccuracy: accuracy,
        hireOutcome: hireOutcome || undefined,
        performanceNote: performanceNote || undefined,
        dimensionFeedback: dimensionFeedback || undefined,
        gateFeedback: gateFeedback || undefined,
        comments: comments || undefined,
      },
    });

    return res.json(feedback);
  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

/**
 * GET /feedback/analytics/accuracy
 * Get aggregate accuracy metrics across all feedback (admin only).
 * MUST be registered BEFORE /feedback/:reportId to avoid route shadowing.
 */
router.get('/feedback/analytics/accuracy', async (req: Request, res: Response) => {
  try {
    if (!req.user || !['owner', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const feedback = await prisma.reportFeedback.findMany({
      where: {},
      select: {
        overallAccuracy: true,
        hireOutcome: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalFeedback = feedback.length;
    const avgAccuracy = totalFeedback > 0
      ? feedback.reduce((sum: number, f: { overallAccuracy: number }) => sum + f.overallAccuracy, 0) / totalFeedback
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
      recentTrend: feedback.slice(0, 20).map((f: { overallAccuracy: number; createdAt: Date }) => ({
        accuracy: f.overallAccuracy,
        date: f.createdAt,
      })),
    });
  } catch (error) {
    console.error('Feedback analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * GET /feedback/:reportId
 * Get feedback for a specific report.
 * Registered AFTER analytics to prevent route shadowing.
 */
router.get('/feedback/:reportId', async (req: Request, res: Response) => {
  try {
    const reportId = qstr(req.params.reportId)!;

    // Verify report belongs to user's org
    const orgId = (req as any).user?.organizationId;
    if (orgId) {
      const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: { session: { select: { organizationId: true } } },
      });
      if (!report || report.session?.organizationId !== orgId) {
        return res.status(404).json({ error: 'Report not found' });
      }
    }

    const feedback = await prisma.reportFeedback.findMany({
      where: { reportId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(feedback);
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;
