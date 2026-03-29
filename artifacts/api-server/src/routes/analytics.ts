import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';

const router = Router();

interface ReportData {
  gateBanner?: { status: string };
  pyramidScore?: {
    overall: number;
    dimensions?: { dimension: string; score: number; weight: number }[];
    deepSignals?: { signal: string; score: number }[];
  };
  deliberation?: {
    finalRecommendation: string;
    assessorVerdicts?: { dimensionScores?: { dimension: string; score: number }[] }[];
  };
  candidateName?: string;
  roleName?: string;
  createdAt?: string;
}

router.get('/analytics/summary', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).user?.organizationId;
    const dbReports = await prisma.report.findMany({
      where: { session: { organizationId: orgId || undefined } },
      orderBy: { createdAt: 'desc' },
      include: {
        session: { select: { id: true, status: true } },
      },
    });

    if (dbReports.length === 0) {
      return res.json({
        totalAssessments: 0,
        passRate: 0,
        avgOverallScore: 0,
        scoresByDimension: [],
        scoresByRoleLevel: [],
        passRateOverTime: [],
        topStrengths: [],
        topConcerns: [],
        scoreDistribution: [],
      });
    }

    const reports = dbReports.map(r => ({
      data: r.reportData as ReportData,
      createdAt: r.createdAt,
      roleName: r.roleName,
    }));

    const totalAssessments = reports.length;

    // Pass rate
    const passedCount = reports.filter(
      r => r.data.gateBanner?.status === 'passed'
    ).length;
    const passRate = Math.round((passedCount / totalAssessments) * 100);

    // Average overall score
    const validScores = reports
      .map(r => r.data.pyramidScore?.overall)
      .filter((s): s is number => typeof s === 'number');
    const avgOverallScore =
      validScores.length > 0
        ? +(validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2)
        : 0;

    // Scores by dimension
    const dimAccum: Record<string, { sum: number; count: number }> = {};
    for (const r of reports) {
      const dims = r.data.pyramidScore?.dimensions;
      if (!dims) continue;
      for (const d of dims) {
        if (!dimAccum[d.dimension]) dimAccum[d.dimension] = { sum: 0, count: 0 };
        dimAccum[d.dimension].sum += d.score;
        dimAccum[d.dimension].count += 1;
      }
    }
    const scoresByDimension = Object.entries(dimAccum).map(([dimension, v]) => ({
      dimension,
      avg: +(v.sum / v.count).toFixed(2),
    }));

    // Scores by role level — extract from roleName heuristic or session setup
    // The roleName field often contains the role level info
    const roleLevelAccum: Record<string, { sum: number; count: number }> = {};
    for (const r of reports) {
      const overall = r.data.pyramidScore?.overall;
      if (typeof overall !== 'number') continue;
      // Try to extract a role level category from the role name
      const rn = r.roleName.toLowerCase();
      let level = 'Other';
      if (rn.includes('c-suite') || rn.includes('ceo') || rn.includes('cto') || rn.includes('cfo') || rn.includes('chief')) level = 'C-Suite';
      else if (rn.includes('vp') || rn.includes('vice president')) level = 'VP';
      else if (rn.includes('director')) level = 'Director';
      else if (rn.includes('senior manager') || rn.includes('sr. manager')) level = 'Senior Manager';
      else if (rn.includes('manager')) level = 'Manager';

      if (!roleLevelAccum[level]) roleLevelAccum[level] = { sum: 0, count: 0 };
      roleLevelAccum[level].sum += overall;
      roleLevelAccum[level].count += 1;
    }
    const scoresByRoleLevel = Object.entries(roleLevelAccum).map(([level, v]) => ({
      level,
      avg: +(v.sum / v.count).toFixed(2),
      count: v.count,
    }));

    // Pass rate over time (by month)
    const monthAccum: Record<string, { passed: number; total: number }> = {};
    for (const r of reports) {
      const d = new Date(r.createdAt);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthAccum[month]) monthAccum[month] = { passed: 0, total: 0 };
      monthAccum[month].total += 1;
      if (r.data.gateBanner?.status === 'passed') monthAccum[month].passed += 1;
    }
    const passRateOverTime = Object.entries(monthAccum)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({
        month,
        rate: Math.round((v.passed / v.total) * 100),
        count: v.total,
      }));

    // Top strengths & concerns from deep signals
    const signalAccum: Record<string, { sum: number; count: number }> = {};
    for (const r of reports) {
      const signals = r.data.pyramidScore?.deepSignals;
      if (!signals) continue;
      for (const s of signals) {
        if (!signalAccum[s.signal]) signalAccum[s.signal] = { sum: 0, count: 0 };
        signalAccum[s.signal].sum += s.score;
        signalAccum[s.signal].count += 1;
      }
    }
    const allSignals = Object.entries(signalAccum)
      .map(([signal, v]) => ({ signal, avg: +(v.sum / v.count).toFixed(2) }))
      .sort((a, b) => b.avg - a.avg);

    const topStrengths = allSignals.slice(0, 5);
    const topConcerns = [...allSignals].sort((a, b) => a.avg - b.avg).slice(0, 5);

    // Score distribution (buckets)
    const buckets = [
      { range: '1-2', min: 1, max: 2, count: 0 },
      { range: '2-3', min: 2, max: 3, count: 0 },
      { range: '3-4', min: 3, max: 4, count: 0 },
      { range: '4-5', min: 4, max: 5, count: 0 },
    ];
    for (const s of validScores) {
      for (const b of buckets) {
        if (s >= b.min && (s < b.max || (b.max === 5 && s <= 5))) {
          b.count += 1;
          break;
        }
      }
    }
    const scoreDistribution = buckets.map(b => ({ range: b.range, count: b.count }));

    return res.json({
      totalAssessments,
      passRate,
      avgOverallScore,
      scoresByDimension,
      scoresByRoleLevel,
      passRateOverTime,
      topStrengths,
      topConcerns,
      scoreDistribution,
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
