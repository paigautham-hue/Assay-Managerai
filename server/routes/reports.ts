import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { qstr } from '../lib/queryHelpers.js';

const router = Router();

router.get('/reports', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).user?.organizationId;
    const dbReports = await prisma.report.findMany({
      where: { session: { organizationId: orgId || undefined } },
      orderBy: { createdAt: 'desc' },
      include: {
        session: { select: { id: true, status: true, voiceProvider: true } },
      },
    });

    const reports = dbReports.map((r: any) => ({
      ...(r.reportData as object),
      id: r.id,
      sessionId: r.sessionId,
      candidateName: r.candidateName,
      roleName: r.roleName,
      createdAt: r.createdAt.toISOString(),
    }));

    return res.json(reports);
  } catch (error) {
    console.error('List reports error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/reports/:id', async (req: Request, res: Response) => {
  try {
    const dbReport = await prisma.report.findUnique({
      where: { id: qstr(req.params.id)! },
      include: {
        session: {
          include: {
            transcripts: { orderBy: { timestamp: 'asc' } },
            observations: { orderBy: { timestamp: 'asc' } },
            verdicts: true,
          },
        },
      },
    });

    if (!dbReport) return res.status(404).json({ error: 'Report not found' });

    // Verify org ownership
    const orgId = (req as any).user?.organizationId;
    if (orgId && dbReport.session?.organizationId !== orgId) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = {
      ...(dbReport.reportData as object),
      id: dbReport.id,
      sessionId: dbReport.sessionId,
      candidateName: dbReport.candidateName,
      roleName: dbReport.roleName,
      createdAt: dbReport.createdAt.toISOString(),
    };

    return res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reports', async (req: Request, res: Response) => {
  try {
    const { id, sessionId, candidateName, roleName } = req.body;

    if (!sessionId || !candidateName || !roleName) {
      return res.status(400).json({ error: 'sessionId, candidateName, and roleName are required' });
    }

    // Verify the session belongs to the user's org
    const orgId = (req as any).user?.organizationId;
    if (orgId) {
      const session = await prisma.interviewSession.findUnique({ where: { id: sessionId }, select: { organizationId: true } });
      if (!session || session.organizationId !== orgId) {
        return res.status(404).json({ error: 'Session not found' });
      }
    }

    const dbReport = await prisma.report.upsert({
      where: { id: id || 'nonexistent-id-placeholder' },
      create: {
        id: id || undefined,
        sessionId,
        candidateName,
        roleName,
        reportData: req.body,
      },
      update: {
        reportData: req.body,
        candidateName,
        roleName,
      },
    });

    const report = {
      ...req.body,
      id: dbReport.id,
      createdAt: dbReport.createdAt.toISOString(),
    };

    return res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/reports/:id', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).user?.organizationId;
    // Verify org ownership before deleting
    const report = await prisma.report.findUnique({
      where: { id: qstr(req.params.id)! },
      include: { session: { select: { organizationId: true } } },
    });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (orgId && report.session?.organizationId !== orgId) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await prisma.report.delete({ where: { id: report.id } });
    return res.json({ success: true });
  } catch (error) {
    if ((error as any).code === 'P2025') return res.status(404).json({ error: 'Report not found' });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
