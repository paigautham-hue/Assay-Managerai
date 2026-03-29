import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { analyzeLinkedIn, analyzeFit, generateBriefing, compileDossier } from '../lib/candidateIntelligenceEngine.js';

const router = Router();

// Analyze LinkedIn profile text
router.post('/candidates/:id/analyze-linkedin', async (req: Request, res: Response) => {
  try {
    const { profileText } = req.body;
    if (!profileText || profileText.length < 50) {
      return res.status(400).json({ error: 'profileText is required (min 50 chars). Paste the LinkedIn profile content.' });
    }

    const candidate = await prisma.candidate.findUnique({ where: { id: req.params.id } });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const analysis = await analyzeLinkedIn(profileText);

    await prisma.candidateIntelligence.create({
      data: {
        candidateId: req.params.id,
        type: 'linkedin_analysis',
        data: analysis as any,
        sourceText: profileText.substring(0, 5000),
      },
    });

    return res.json({ analysis });
  } catch (error) {
    console.error('LinkedIn analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze LinkedIn profile' });
  }
});

// Analyze candidate-role fit
router.post('/candidates/:id/analyze-fit', async (req: Request, res: Response) => {
  try {
    const { roleName, roleLevel, jobDescription, activeGates } = req.body;
    if (!roleName || !roleLevel) {
      return res.status(400).json({ error: 'roleName and roleLevel are required' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: req.params.id },
      include: { intelligence: { where: { type: { in: ['resume_analysis', 'linkedin_analysis'] } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const resumeAnalysis = candidate.intelligence.find((i: any) => i.type === 'resume_analysis')?.data;
    const linkedinAnalysis = candidate.intelligence.find((i: any) => i.type === 'linkedin_analysis')?.data;

    const analysis = await analyzeFit(
      { resumeAnalysis: resumeAnalysis as any, linkedinAnalysis: linkedinAnalysis as any,
        currentRole: candidate.currentRole || undefined, yearsExperience: candidate.yearsExperience || undefined },
      { roleName, roleLevel, jobDescription, activeGates }
    );

    await prisma.candidateIntelligence.create({
      data: {
        candidateId: req.params.id,
        type: 'fit_analysis',
        data: analysis as any,
      },
    });

    return res.json({ analysis });
  } catch (error) {
    console.error('Fit analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze fit' });
  }
});

// Generate pre-interview briefing
router.post('/candidates/:id/generate-briefing', async (req: Request, res: Response) => {
  try {
    const { roleName, roleLevel, jobDescription, activeGates } = req.body;
    if (!roleName || !roleLevel) {
      return res.status(400).json({ error: 'roleName and roleLevel are required' });
    }

    const dossier = await compileDossier(prisma, req.params.id);
    const briefing = await generateBriefing(dossier, { roleName, roleLevel, jobDescription, activeGates });

    await prisma.candidateIntelligence.create({
      data: {
        candidateId: req.params.id,
        type: 'briefing',
        data: briefing as any,
      },
    });

    return res.json({ briefing, dossier });
  } catch (error) {
    console.error('Briefing generation error:', error);
    return res.status(500).json({ error: 'Failed to generate briefing' });
  }
});

// Get all intelligence records
router.get('/candidates/:id/intelligence', async (req: Request, res: Response) => {
  try {
    const intelligence = await prisma.candidateIntelligence.findMany({
      where: { candidateId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(intelligence);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get intelligence' });
  }
});

export default router;
