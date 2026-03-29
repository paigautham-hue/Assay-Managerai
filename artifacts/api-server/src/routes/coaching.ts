import { Router } from 'express';
import type { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import prisma from '../db/prisma.js';
import { qstr } from '../lib/queryHelpers.js';

const router = Router();

router.post('/reports/:id/coaching', async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: qstr(req.params.id)! } });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (report.coachingReport) return res.json(report.coachingReport);

    const data = report.reportData as any;
    const anthropic = new Anthropic();

    const prompt = `You are a warm, encouraging executive coach. Based on this interview assessment data, generate a coaching report FOR THE CANDIDATE (not the hiring manager). Be constructive, specific, and actionable.

CANDIDATE: ${report.candidateName}
ROLE: ${report.roleName}
OVERALL SCORE: ${data.pyramidScore?.overall || 'N/A'}/5
GATE STATUS: ${data.gateBanner?.status || 'N/A'}

DIMENSION SCORES:
${(data.pyramidScore?.dimensions || []).map((d: any) => `- ${d.dimension}: ${d.score}/5`).join('\n')}

DEEP SIGNALS:
${(data.deepSignals?.signals || []).map((s: any) => `- ${s.signal}: ${s.score}/5`).join('\n')}

EXECUTIVE SUMMARY: ${data.executiveSummary || 'N/A'}

PROSODY DATA:
- Authenticity Score: ${data.prosodyData?.authenticityScore || 'N/A'}
- Confidence Score: ${data.prosodyData?.confidenceScore || 'N/A'}
- Stress Level: ${data.prosodyData?.stressLevel || 'N/A'}

Respond with ONLY valid JSON (no markdown):
{
  "overallImpression": "A warm 2-3 sentence summary of their interview performance",
  "communicationStrengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "areasForGrowth": ["area 1", "area 2", "area 3"],
  "actionableRecommendations": [
    { "area": "area name", "suggestion": "specific actionable advice", "priority": "high" },
    { "area": "area name", "suggestion": "specific actionable advice", "priority": "medium" },
    { "area": "area name", "suggestion": "specific actionable advice", "priority": "low" }
  ],
  "interviewTips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "encouragingNote": "A warm, personal closing message encouraging the candidate"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    let coaching;
    try {
      coaching = JSON.parse(text.trim());
    } catch {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        coaching = JSON.parse(text.slice(start, end + 1));
      } else {
        throw new Error('Failed to parse coaching response');
      }
    }

    await prisma.report.update({
      where: { id: qstr(req.params.id)! },
      data: { coachingReport: coaching },
    });

    return res.json(coaching);
  } catch (error) {
    console.error('Coaching generation error:', error);
    return res.status(500).json({ error: 'Failed to generate coaching report' });
  }
});

router.get('/reports/:id/coaching', async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: qstr(req.params.id)! },
      select: { coachingReport: true },
    });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (!report.coachingReport) return res.status(404).json({ error: 'No coaching report generated yet' });
    return res.json(report.coachingReport);
  } catch (error) {
    console.error('Get coaching error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
