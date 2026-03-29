import { Router } from 'express';
import type { Request, Response } from 'express';
import { EventEmitter } from 'events';
import prisma from '../db/prisma.js';
import { qstr } from '../lib/queryHelpers.js';

const router = Router();

// In-memory pub/sub for SSE broadcast
const calibrationEmitter = new EventEmitter();
calibrationEmitter.setMaxListeners(100);

// Track connected SSE clients per session for viewer count
const sseClients = new Map<string, Set<Response>>();

// ─── Create calibration session ──────────────────────────────────────────────
router.post('/calibration', async (req: Request, res: Response) => {
  try {
    const { reportId, title } = req.body;
    if (!reportId || !title) {
      return res.status(400).json({ error: 'reportId and title are required' });
    }

    // Verify report's session belongs to user's org
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

    const session = await prisma.calibrationSession.create({
      data: { reportId, title, organizationId: orgId || null },
    });

    return res.status(201).json(session);
  } catch (err: any) {
    console.error('[CALIBRATION] Create error:', err);
    return res.status(500).json({ error: 'Failed to create calibration session' });
  }
});

// ─── Get calibration sessions for a report ───────────────────────────────────
// NOTE: This route MUST be registered before `/calibration/:id` to prevent
// "by-report" from being captured as an :id parameter (route shadowing).
router.get('/calibration/by-report/:reportId', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).user?.organizationId;
    const where: any = { reportId: qstr(req.params.reportId)! };
    if (orgId) where.organizationId = orgId;

    const sessions = await prisma.calibrationSession.findMany({
      where,
      include: { notes: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(sessions);
  } catch (err: any) {
    console.error('[CALIBRATION] Get by report error:', err);
    return res.status(500).json({ error: 'Failed to fetch calibration sessions' });
  }
});

// ─── Get calibration session with notes ──────────────────────────────────────
router.get('/calibration/:id', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).user?.organizationId;
    const session = await prisma.calibrationSession.findUnique({
      where: { id: qstr(req.params.id)! },
      include: { notes: { orderBy: { createdAt: 'asc' } } },
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (orgId && session.organizationId !== orgId) {
      return res.status(404).json({ error: 'Session not found' });
    }
    return res.json(session);
  } catch (err: any) {
    console.error('[CALIBRATION] Get error:', err);
    return res.status(500).json({ error: 'Failed to fetch calibration session' });
  }
});

// ─── Add a note ──────────────────────────────────────────────────────────────
router.post('/calibration/:id/notes', async (req: Request, res: Response) => {
  try {
    const { content, sectionRef } = req.body;
    const paramId = qstr(req.params.id)!;
    if (!content) return res.status(400).json({ error: 'content is required' });
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const session = await prisma.calibrationSession.findUnique({
      where: { id: paramId },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Verify org ownership
    const orgId = req.user?.organizationId;
    if (orgId && session.organizationId !== orgId) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const note = await prisma.calibrationNote.create({
      data: {
        calibrationSessionId: paramId,
        userId: req.user.id,
        userName: req.user.name,
        content,
        sectionRef: sectionRef || null,
      },
    });

    // Broadcast to all SSE clients for this session
    calibrationEmitter.emit(`note:${paramId}`, note);

    return res.status(201).json(note);
  } catch (err: any) {
    console.error('[CALIBRATION] Add note error:', err);
    return res.status(500).json({ error: 'Failed to add note' });
  }
});

// ─── SSE stream for real-time note updates ───────────────────────────────────
router.get('/calibration/:id/stream', async (req: Request, res: Response) => {
  const sessionId = qstr(req.params.id)!;

  // Verify org ownership for SSE stream
  const orgId = (req as any).user?.organizationId;
  if (orgId) {
    const calSession = await prisma.calibrationSession.findUnique({ where: { id: sessionId } });
    if (!calSession || calSession.organizationId !== orgId) {
      return res.status(404).json({ error: 'Session not found' });
    }
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  // Register client
  if (!sseClients.has(sessionId)) {
    sseClients.set(sessionId, new Set());
  }
  sseClients.get(sessionId)!.add(res);

  // Broadcast updated viewer count
  const broadcastViewerCount = () => {
    const count = sseClients.get(sessionId)?.size || 0;
    const clients = sseClients.get(sessionId);
    if (clients) {
      for (const client of clients) {
        client.write(`event: viewers\ndata: ${JSON.stringify({ count })}\n\n`);
      }
    }
  };

  broadcastViewerCount();

  // Send keepalive every 30s
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  // Listen for new notes
  const onNote = (note: any) => {
    res.write(`event: note\ndata: ${JSON.stringify(note)}\n\n`);
  };
  calibrationEmitter.on(`note:${sessionId}`, onNote);

  // Listen for status changes
  const onStatus = (data: any) => {
    res.write(`event: status\ndata: ${JSON.stringify(data)}\n\n`);
  };
  calibrationEmitter.on(`status:${sessionId}`, onStatus);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(keepAlive);
    calibrationEmitter.off(`note:${sessionId}`, onNote);
    calibrationEmitter.off(`status:${sessionId}`, onStatus);
    sseClients.get(sessionId)?.delete(res);
    if (sseClients.get(sessionId)?.size === 0) {
      sseClients.delete(sessionId);
    }
    broadcastViewerCount();
  });

  // SSE connection stays open -- no explicit return needed
  return undefined as any;
});

// ─── Update session status (conclude) ────────────────────────────────────────
router.patch('/calibration/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const paramId = qstr(req.params.id)!;
    if (!status) return res.status(400).json({ error: 'status is required' });

    // Verify org ownership before updating
    const orgId = (req as any).user?.organizationId;
    if (orgId) {
      const existing = await prisma.calibrationSession.findUnique({ where: { id: paramId } });
      if (!existing || existing.organizationId !== orgId) {
        return res.status(404).json({ error: 'Session not found' });
      }
    }

    const session = await prisma.calibrationSession.update({
      where: { id: paramId },
      data: { status },
    });

    // Broadcast status change to SSE clients
    calibrationEmitter.emit(`status:${paramId}`, { status: session.status });

    return res.json(session);
  } catch (err: any) {
    console.error('[CALIBRATION] Update error:', err);
    return res.status(500).json({ error: 'Failed to update calibration session' });
  }
});

export default router;
