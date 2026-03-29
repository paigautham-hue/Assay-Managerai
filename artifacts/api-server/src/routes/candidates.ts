import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { compileDossier, formatDossierForPrompt } from '../lib/candidateIntelligenceEngine.js';

const router = Router();

// Create candidate
router.post('/candidates', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, linkedinUrl, githubUrl, portfolioUrl, source, sourceDetail,
            currentRole, currentCompany, yearsExperience, salaryExpectation, noticePeriod, tags } = req.body;

    if (!name) return res.status(400).json({ error: 'name is required' });

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
        source: source || null,
        sourceDetail: sourceDetail || null,
        currentRole: currentRole || null,
        currentCompany: currentCompany || null,
        yearsExperience: yearsExperience ? Number(yearsExperience) : null,
        salaryExpectation: salaryExpectation || null,
        noticePeriod: noticePeriod || null,
        tags: tags || [],
        organizationId: (req as any).user?.organizationId || null,
      },
    });

    return res.status(201).json(candidate);
  } catch (error) {
    console.error('Create candidate error:', error);
    return res.status(500).json({ error: 'Failed to create candidate' });
  }
});

// List candidates with filters
router.get('/candidates', async (req: Request, res: Response) => {
  try {
    const { stage, search, source, limit = '50', offset = '0' } = req.query;
    const orgId = (req as any).user?.organizationId;

    const where: any = {};
    if (orgId) where.organizationId = orgId;
    if (stage && stage !== 'all') where.pipelineStage = stage as string;
    if (source) where.source = source as string;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { currentRole: { contains: search as string, mode: 'insensitive' } },
        { currentCompany: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          sessions: { select: { id: true, status: true, createdAt: true, setup: true }, orderBy: { createdAt: 'desc' }, take: 1 },
          intelligence: { select: { type: true, data: true }, where: { type: 'fit_analysis' }, take: 1 },
          _count: { select: { references: true, notes: true, documents: true, sessions: true } },
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    return res.json({ candidates, total });
  } catch (error) {
    console.error('List candidates error:', error);
    return res.status(500).json({ error: 'Failed to list candidates' });
  }
});

// Get candidate with full profile
router.get('/candidates/:id', async (req: Request, res: Response) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: req.params.id },
      include: {
        intelligence: { orderBy: { createdAt: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } },
        references: { orderBy: { createdAt: 'desc' } },
        documents: { select: { id: true, type: true, filename: true, mimeType: true, createdAt: true } },
        sessions: {
          select: { id: true, status: true, createdAt: true, startedAt: true, endedAt: true, setup: true,
                    reports: { select: { id: true, reportData: true, createdAt: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    return res.json(candidate);
  } catch (error) {
    console.error('Get candidate error:', error);
    return res.status(500).json({ error: 'Failed to get candidate' });
  }
});

// Update candidate
router.patch('/candidates/:id', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, linkedinUrl, githubUrl, portfolioUrl, source, sourceDetail,
            currentRole, currentCompany, yearsExperience, salaryExpectation, noticePeriod, tags } = req.body;

    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(source !== undefined && { source }),
        ...(sourceDetail !== undefined && { sourceDetail }),
        ...(currentRole !== undefined && { currentRole }),
        ...(currentCompany !== undefined && { currentCompany }),
        ...(yearsExperience !== undefined && { yearsExperience: yearsExperience ? Number(yearsExperience) : null }),
        ...(salaryExpectation !== undefined && { salaryExpectation }),
        ...(noticePeriod !== undefined && { noticePeriod }),
        ...(tags !== undefined && { tags }),
      },
    });

    return res.json(candidate);
  } catch (error) {
    console.error('Update candidate error:', error);
    return res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Move pipeline stage
router.patch('/candidates/:id/stage', async (req: Request, res: Response) => {
  try {
    const { stage, rejectionReason } = req.body;
    const validStages = ['applied', 'screening', 'interviewing', 'assessed', 'offer', 'hired', 'rejected', 'withdrawn'];
    if (!stage || !validStages.includes(stage)) {
      return res.status(400).json({ error: `stage must be one of: ${validStages.join(', ')}` });
    }

    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: {
        pipelineStage: stage,
        ...(rejectionReason !== undefined && { rejectionReason }),
      },
    });

    return res.json(candidate);
  } catch (error) {
    console.error('Update stage error:', error);
    return res.status(500).json({ error: 'Failed to update pipeline stage' });
  }
});

// Get compiled dossier for AI consumption
router.get('/candidates/:id/dossier', async (req: Request, res: Response) => {
  try {
    const dossier = await compileDossier(prisma, req.params.id);
    const formatted = formatDossierForPrompt(dossier);
    return res.json({ dossier, formatted });
  } catch (error) {
    console.error('Compile dossier error:', error);
    return res.status(500).json({ error: 'Failed to compile dossier' });
  }
});

// Compare candidates
router.get('/candidates/compare', async (req: Request, res: Response) => {
  try {
    const ids = (req.query.ids as string)?.split(',').filter(Boolean);
    if (!ids || ids.length < 2) return res.status(400).json({ error: 'Provide at least 2 candidate IDs as ?ids=a,b' });

    const candidates = await prisma.candidate.findMany({
      where: { id: { in: ids } },
      include: {
        intelligence: { where: { type: { in: ['resume_analysis', 'fit_analysis'] } } },
        references: { where: { status: 'completed' } },
        sessions: {
          select: { id: true, status: true, reports: { select: { reportData: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: { select: { sessions: true } },
      },
    });

    return res.json(candidates);
  } catch (error) {
    console.error('Compare candidates error:', error);
    return res.status(500).json({ error: 'Failed to compare candidates' });
  }
});

export default router;
