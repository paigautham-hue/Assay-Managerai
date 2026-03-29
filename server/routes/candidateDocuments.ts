import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { analyzeResume } from '../lib/candidateIntelligenceEngine.js';
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

// Upload document with text content (frontend extracts text from file)
router.post('/candidates/:id/documents', async (req: Request, res: Response) => {
  try {
    const { type, filename, mimeType, content } = req.body;

    if (!type || !filename || !content) {
      return res.status(400).json({ error: 'type, filename, and content are required' });
    }

    const paramId = qstr(req.params.id)!;
    const candidate = await verifyCandidateOrg(paramId, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const doc = await prisma.candidateDocument.create({
      data: {
        candidateId: paramId,
        type,
        filename,
        mimeType: mimeType || 'text/plain',
        content,
      },
    });

    // Auto-analyze if it's a resume
    if (type === 'resume') {
      try {
        const analysis = await analyzeResume(content);

        await prisma.candidateIntelligence.create({
          data: {
            candidateId: paramId,
            type: 'resume_analysis',
            data: analysis as any,
            sourceText: content.substring(0, 5000),
          },
        });

        // Update candidate profile with extracted data
        const updateData: any = {};
        if (analysis.totalYearsExperience && !candidate.yearsExperience) {
          updateData.yearsExperience = analysis.totalYearsExperience;
        }
        if (analysis.experience?.[0] && !candidate.currentRole) {
          updateData.currentRole = analysis.experience[0].role;
          updateData.currentCompany = analysis.experience[0].company;
        }
        if (Object.keys(updateData).length > 0) {
          await prisma.candidate.update({ where: { id: paramId }, data: updateData });
        }

        return res.status(201).json({ document: doc, analysis });
      } catch (analysisError) {
        console.error('Resume analysis failed (document still saved):', analysisError);
        return res.status(201).json({ document: doc, analysisError: 'AI analysis failed but document was saved' });
      }
    }

    return res.status(201).json({ document: doc });
  } catch (error) {
    console.error('Upload document error:', error);
    return res.status(500).json({ error: 'Failed to upload document' });
  }
});

// List documents
router.get('/candidates/:id/documents', async (req: Request, res: Response) => {
  try {
    const paramId = qstr(req.params.id)!;
    const candidate = await verifyCandidateOrg(paramId, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const docs = await prisma.candidateDocument.findMany({
      where: { candidateId: paramId },
      select: { id: true, type: true, filename: true, mimeType: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(docs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list documents' });
  }
});

// Delete document
router.delete('/candidates/:id/documents/:docId', async (req: Request, res: Response) => {
  try {
    const candidate = await verifyCandidateOrg(qstr(req.params.id)!, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    await prisma.candidateDocument.delete({ where: { id: qstr(req.params.docId)! } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Re-analyze a document
router.post('/candidates/:id/documents/:docId/analyze', async (req: Request, res: Response) => {
  try {
    const candidate = await verifyCandidateOrg(qstr(req.params.id)!, req);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const doc = await prisma.candidateDocument.findUnique({ where: { id: qstr(req.params.docId)! } });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    if (doc.type === 'resume') {
      const analysis = await analyzeResume(doc.content);
      await prisma.candidateIntelligence.create({
        data: {
          candidateId: qstr(req.params.id)!,
          type: 'resume_analysis',
          data: analysis as any,
          sourceText: doc.content.substring(0, 5000),
        },
      });
      return res.json({ analysis });
    }

    return res.status(400).json({ error: 'Only resume documents can be analyzed' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to analyze document' });
  }
});

export default router;
