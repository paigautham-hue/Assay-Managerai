import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

// Add note
router.post('/candidates/:id/notes', async (req: Request, res: Response) => {
  try {
    const { content, type } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const user = (req as any).user;
    const note = await prisma.candidateNote.create({
      data: {
        candidateId: req.params.id,
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
    const notes = await prisma.candidateNote.findMany({
      where: { candidateId: req.params.id },
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
    await prisma.candidateNote.delete({ where: { id: req.params.noteId } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
