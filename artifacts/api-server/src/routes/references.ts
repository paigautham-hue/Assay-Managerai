import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { analyzeReference } from '../lib/candidateIntelligenceEngine.js';
import crypto from 'crypto';

const router = Router();

const REFERENCE_QUESTIONS = [
  { id: 'relationship', question: 'What was your working relationship with the candidate?', type: 'text' },
  { id: 'duration', question: 'How long did you work together?', type: 'text' },
  { id: 'strengths', question: 'What are their greatest professional strengths?', type: 'textarea' },
  { id: 'growth_areas', question: 'What areas would you suggest for professional development?', type: 'textarea' },
  { id: 'performance', question: 'How would you rate their overall performance?', type: 'rating', scale: 5 },
  { id: 'leadership', question: 'How would you rate their leadership ability?', type: 'rating', scale: 5 },
  { id: 'collaboration', question: 'How well do they work with others?', type: 'rating', scale: 5 },
  { id: 'integrity', question: 'How would you rate their integrity and trustworthiness?', type: 'rating', scale: 5 },
  { id: 'pressure', question: 'How do they handle pressure and challenging situations?', type: 'textarea' },
  { id: 'rehire', question: 'Would you work with this person again?', type: 'select', options: ['Definitely yes', 'Probably yes', 'Maybe', 'Probably not', 'Definitely not'] },
  { id: 'additional', question: 'Is there anything else you would like to share?', type: 'textarea' },
];

// Add referee
router.post('/candidates/:id/references', async (req: Request, res: Response) => {
  try {
    const { refereeName, refereeEmail, refereePhone, refereeRelation, refereeCompany } = req.body;
    if (!refereeName || !refereeRelation) {
      return res.status(400).json({ error: 'refereeName and refereeRelation are required' });
    }

    const reference = await prisma.candidateReference.create({
      data: {
        candidateId: req.params.id,
        refereeName,
        refereeEmail: refereeEmail || null,
        refereePhone: refereePhone || null,
        refereeRelation,
        refereeCompany: refereeCompany || null,
      },
    });

    return res.status(201).json(reference);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add reference' });
  }
});

// List references
router.get('/candidates/:id/references', async (req: Request, res: Response) => {
  try {
    const references = await prisma.candidateReference.findMany({
      where: { candidateId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(references);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list references' });
  }
});

// Update reference
router.patch('/candidates/:id/references/:refId', async (req: Request, res: Response) => {
  try {
    const { refereeName, refereeEmail, refereePhone, refereeRelation, refereeCompany, status } = req.body;
    const reference = await prisma.candidateReference.update({
      where: { id: req.params.refId },
      data: {
        ...(refereeName && { refereeName }),
        ...(refereeEmail !== undefined && { refereeEmail }),
        ...(refereePhone !== undefined && { refereePhone }),
        ...(refereeRelation && { refereeRelation }),
        ...(refereeCompany !== undefined && { refereeCompany }),
        ...(status && { status }),
      },
    });
    return res.json(reference);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update reference' });
  }
});

// Generate and "send" reference questionnaire (generates public token)
router.post('/candidates/:id/references/:refId/send', async (req: Request, res: Response) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const reference = await prisma.candidateReference.update({
      where: { id: req.params.refId },
      data: { token, status: 'sent' },
    });

    // In production, you'd send an email here with the link
    const referenceUrl = `/reference/${token}`;

    return res.json({ reference, referenceUrl, token });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send reference request' });
  }
});

// AI analysis of completed reference
router.post('/candidates/:id/references/:refId/analyze', async (req: Request, res: Response) => {
  try {
    const reference = await prisma.candidateReference.findUnique({ where: { id: req.params.refId } });
    if (!reference) return res.status(404).json({ error: 'Reference not found' });
    if (!reference.responses) return res.status(400).json({ error: 'No responses to analyze' });

    const candidate = await prisma.candidate.findUnique({ where: { id: req.params.id } });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const analysis = await analyzeReference(
      reference.refereeName,
      reference.refereeRelation,
      reference.responses as Record<string, any>,
      candidate.name
    );

    await prisma.candidateReference.update({
      where: { id: req.params.refId },
      data: { aiAnalysis: analysis as any },
    });

    return res.json({ analysis });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to analyze reference' });
  }
});

// ── Public Routes (no auth) ──────────────────────────────────────────────────

// Get reference form (public)
router.get('/public/reference/:token', async (req: Request, res: Response) => {
  try {
    const reference = await prisma.candidateReference.findUnique({
      where: { token: req.params.token },
      include: { candidate: { select: { name: true } } },
    });

    if (!reference) return res.status(404).json({ error: 'Reference form not found or expired' });
    if (reference.status === 'completed') return res.status(400).json({ error: 'This reference has already been submitted' });

    return res.json({
      candidateName: reference.candidate.name,
      refereeName: reference.refereeName,
      questions: REFERENCE_QUESTIONS,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load reference form' });
  }
});

// Submit reference (public)
router.post('/public/reference/:token', async (req: Request, res: Response) => {
  try {
    const { responses } = req.body;
    if (!responses) return res.status(400).json({ error: 'responses are required' });

    const reference = await prisma.candidateReference.findUnique({ where: { token: req.params.token } });
    if (!reference) return res.status(404).json({ error: 'Reference form not found' });
    if (reference.status === 'completed') return res.status(400).json({ error: 'Already submitted' });

    await prisma.candidateReference.update({
      where: { token: req.params.token },
      data: {
        responses: responses as any,
        status: 'completed',
        completedAt: new Date(),
      },
    });

    return res.json({ success: true, message: 'Thank you for your reference. Your responses have been recorded.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to submit reference' });
  }
});

export default router;
