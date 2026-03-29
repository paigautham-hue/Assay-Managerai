import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { analyzeLinkedIn, analyzeFit, generateBriefing, compileDossier } from '../lib/candidateIntelligenceEngine.js';
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

// Analyze LinkedIn profile text
router.post('/candidates/:id/analyze-linkedin', async (req: Request, res: Response) => {
  try {
    const { profileText } = req.body;
    if (!profileText || profileText.length < 50) {
      return res.status(400).json({ error: 'profileText is required (min 50 chars). Paste the LinkedIn profile content.' });
    }

    const paramId = qstr(req.params.id)!;
    const candidate = await verifyCandidateOrg(paramId, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const analysis = await analyzeLinkedIn(profileText);

    await prisma.candidateIntelligence.create({
      data: {
        candidateId: paramId,
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

    const fitParamId = qstr(req.params.id)!;
    const candidateCheck = await verifyCandidateOrg(fitParamId, req);
    if (!candidateCheck) return res.status(404).json({ error: 'Candidate not found' });

    const candidate = await prisma.candidate.findUnique({
      where: { id: fitParamId },
      include: { intelligence: { where: { type: { in: ['resume_analysis', 'linkedin_analysis'] } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const resumeAnalysis = (candidate as any).intelligence?.find((i: any) => i.type === 'resume_analysis')?.data;
    const linkedinAnalysis = (candidate as any).intelligence?.find((i: any) => i.type === 'linkedin_analysis')?.data;

    const analysis = await analyzeFit(
      { resumeAnalysis: resumeAnalysis as any, linkedinAnalysis: linkedinAnalysis as any,
        currentRole: candidate.currentRole || undefined, yearsExperience: candidate.yearsExperience || undefined },
      { roleName, roleLevel, jobDescription, activeGates }
    );

    await prisma.candidateIntelligence.create({
      data: {
        candidateId: fitParamId,
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

    const briefParamId = qstr(req.params.id)!;
    const candidateCheck2 = await verifyCandidateOrg(briefParamId, req);
    if (!candidateCheck2) return res.status(404).json({ error: 'Candidate not found' });

    const dossier = await compileDossier(prisma, briefParamId);
    const briefing = await generateBriefing(dossier, { roleName, roleLevel, jobDescription, activeGates });

    await prisma.candidateIntelligence.create({
      data: {
        candidateId: briefParamId,
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
    const intParamId = qstr(req.params.id)!;
    const candidateCheck3 = await verifyCandidateOrg(intParamId, req);
    if (!candidateCheck3) return res.status(404).json({ error: 'Candidate not found' });

    const intelligence = await prisma.candidateIntelligence.findMany({
      where: { candidateId: intParamId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(intelligence);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get intelligence' });
  }
});

export default router;
