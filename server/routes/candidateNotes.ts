import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { qstr } from '../lib/queryHelpers.js';

const router = Router();

/** Verify candidate belongs to the user's organization. Returns the candidate or null. */
async function verifyCandidateOrg(candidateId: string, req: Request): Promise<any> {
  const orgId = (req as any).user?.organizationId;
  if (orgId) {
    return prisma.candidate.findFirst({ where: { id: candidateId, organizationId: orgId } });
  }
  return prisma.candidate.findUnique({ where: { id: candidateId } });
}

// Add note
router.post('/candidates/:id/notes', async (req: Request, res: Response) => {
  try {
    const { content, type } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const candidate = await verifyCandidateOrg(qstr(req.params.id)!, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const user = (req as any).user;
    const note = await prisma.candidateNote.create({
      data: {
        candidateId: qstr(req.params.id)!,
        userId: user?.id || 'system',
        userName: user?.name || 'System',
        content,
        type: type || 'general',
      },
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add note' });
  }
});

// List notes
router.get('/candidates/:id/notes', async (req: Request, res: Response) => {
  try {
    const noteParamId = qstr(req.params.id)!;
    const candidate = await verifyCandidateOrg(noteParamId, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const notes = await prisma.candidateNote.findMany({
      where: { candidateId: noteParamId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list notes' });
  }
});

// Delete note
router.delete('/candidates/:id/notes/:noteId', async (req: Request, res: Response) => {
  try {
    const candidate = await verifyCandidateOrg(qstr(req.params.id)!, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    await prisma.candidateNote.delete({ where: { id: qstr(req.params.noteId)! } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
