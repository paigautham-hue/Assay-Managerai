import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

const DIMENSION_DISPLAY_NAMES: Record<string, string> = {
  domain_expertise: 'Domain Expertise',
  hands_on_accountability: 'Hands-On & Accountability',
  character: 'Character (Good Person)',
  people_influence: 'People & Influence',
  strategy_change: 'Strategy & Change',
  motivation: 'Motivation & Alignment',
  financial_fit: 'Financial Fit',
};

function evaluateGates(verdicts: any[]): { overallStatus: 'passed' | 'flagged' | 'failed'; evaluations: any[] } {
  const gateMap = new Map<string, any[]>();

  for (const verdict of verdicts) {
    for (const gate of (verdict.gateEvaluations || [])) {
      if (!gateMap.has(gate.gate)) gateMap.set(gate.gate, []);
      gateMap.get(gate.gate)!.push(gate);
    }
  }

  const CORE_GATES = new Set(['integrity', 'accountability', 'harm_pattern', 'context_misalignment']);
  const evaluations: any[] = [];

  for (const [gateName, evals] of gateMap) {
    const hasFail = evals.some(e => e.confidence === 'FAIL');
    const hasFlag = evals.some(e => e.confidence === 'FLAG');
    const hasInsufficient = evals.every(e => e.confidence === 'INSUFFICIENT_DATA');

    let finalConfidence: string;
    if (hasFail) finalConfidence = 'FAIL';
    else if (hasFlag) finalConfidence = 'FLAG';
    else if (hasInsufficient) finalConfidence = 'INSUFFICIENT_DATA';
    else finalConfidence = 'PASS';

    evaluations.push({
      gate: gateName,
      confidence: finalConfidence,
      isCore: CORE_GATES.has(gateName),
      evidence: evals.flatMap(e => e.evidence || []),
      triggerDetails: evals.find(e => e.triggerDetails)?.triggerDetails || '',
      assessorSource: evals.map(e => e.assessorSource).filter(Boolean).join(', '),
    });
  }

  const hasCoreFailure = evaluations.filter(e => e.isCore).some(e => e.confidence === 'FAIL');
  const hasAnyFlag = evaluations.some(e => e.confidence === 'FLAG');
  const overallStatus = hasCoreFailure ? 'failed' : hasAnyFlag ? 'flagged' : 'passed';

  return { overallStatus, evaluations };
}

function calculatePyramidScore(dimensionScores: Record<string, { score: number; weight: number }>): {
  overall: number; meetsBar: boolean; characterClear: boolean; handsOnClear: boolean;
} {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const d of Object.values(dimensionScores)) {
    weightedSum += d.score * d.weight;
    totalWeight += d.weight;
  }

  const overall = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const characterScore = dimensionScores['character']?.score ?? 5;
  const handsOnScore = dimensionScores['hands_on_accountability']?.score ?? 5;
  const characterClear = characterScore >= 3.0;
  const handsOnClear = handsOnScore >= 3.0;
  const meetsBar = overall >= 4.0 && characterClear && handsOnClear;

  return { overall: Math.round(overall * 100) / 100, meetsBar, characterClear, handsOnClear };
}

router.post('/report', async (req: Request, res: Response) => {
  try {
    const { sessionId, candidateName, roleName, assessorVerdicts, chairmanSynthesis, transcript, setup } = req.body;

    if (!sessionId || !candidateName || !roleName) {
      return res.status(400).json({ error: 'sessionId, candidateName, and roleName are required' });
    }

    if (!assessorVerdicts || !Array.isArray(assessorVerdicts) || assessorVerdicts.length === 0) {
      return res.status(400).json({ error: 'assessorVerdicts array is required and must not be empty' });
    }

    if (!chairmanSynthesis) {
      return res.status(400).json({ error: 'chairmanSynthesis is required' });
    }

    // Evaluate gates
    const { overallStatus: gateStatus, evaluations: gateEvaluations } = evaluateGates(assessorVerdicts);

    // Aggregate dimension scores
    const dimensionScoreMap = new Map<string, { scores: number[]; weights: number[]; allEvidence: string[] }>();

    for (const verdict of assessorVerdicts) {
      for (const dimScore of (verdict.dimensionScores || [])) {
        if (!dimensionScoreMap.has(dimScore.dimension)) {
          dimensionScoreMap.set(dimScore.dimension, { scores: [], weights: [], allEvidence: [] });
        }
        const entry = dimensionScoreMap.get(dimScore.dimension)!;
        entry.scores.push(dimScore.score);
        entry.weights.push(dimScore.weight);
        entry.allEvidence.push(...(dimScore.evidence || []));
      }
    }

    const aggregatedDimensions: any[] = [];
    for (const [dimension, data] of dimensionScoreMap.entries()) {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      const avgWeight = data.weights.reduce((a, b) => a + b, 0) / data.weights.length;

      const assessorNotes: Record<string, string> = {};
      for (const verdict of assessorVerdicts) {
        const dimScore = verdict.dimensionScores?.find((d: any) => d.dimension === dimension);
        if (dimScore) {
          assessorNotes[verdict.role] = `Score: ${dimScore.score}/5. Evidence: ${dimScore.evidence?.join('; ') || 'none'}`;
        }
      }

      aggregatedDimensions.push({
        dimension,
        score: Math.round(avgScore * 100) / 100,
        weight: Math.round(avgWeight * 100) / 100,
        evidence: [...new Set(data.allEvidence)],
        assessorNotes,
      });
    }

    // Calculate pyramid score
    const dimensionDict = Object.fromEntries(
      aggregatedDimensions.map(d => [d.dimension, { score: d.score, weight: d.weight }])
    );
    const { overall: pyramidScoreValue, meetsBar, characterClear, handsOnClear } = calculatePyramidScore(dimensionDict);

    // Gate banners
    const failedGates = gateEvaluations.filter(g => g.confidence === 'FAIL');
    const flaggedGates = gateEvaluations.filter(g => g.confidence === 'FLAG');

    let gateBannerStatus: 'passed' | 'flagged' | 'failed' = 'passed';
    let gateBannerMessage = 'All non-negotiable gates passed.';

    if (failedGates.length > 0) {
      gateBannerStatus = 'failed';
      gateBannerMessage = `Non-negotiable gates FAILED: ${failedGates.map(g => g.gate).join(', ')}. This candidate does not proceed.`;
    } else if (flaggedGates.length > 0) {
      gateBannerStatus = 'flagged';
      gateBannerMessage = `Some gates FLAGGED: ${flaggedGates.map(g => g.gate).join(', ')}. Proceed with caution.`;
    }

    // Deep assessment by dimension
    const deepAssessment = aggregatedDimensions.map(dim => {
      const dimensionVerdicts = assessorVerdicts.map((v: any) => {
        const ds = v.dimensionScores?.find((d: any) => d.dimension === dim.dimension);
        return ds ? { role: v.role, score: ds.score, evidence: ds.evidence || [] } : null;
      }).filter(Boolean);

      const allEvidence = dimensionVerdicts.flatMap((v: any) => v?.evidence || []);
      const half = Math.ceil(allEvidence.length / 2);

      return {
        dimension: dim.dimension,
        narrative: `The candidate demonstrates ${dim.score >= 4 ? 'strong' : dim.score >= 3 ? 'moderate' : 'developing'} capability in ${DIMENSION_DISPLAY_NAMES[dim.dimension] || dim.dimension}. Assessors: ${dimensionVerdicts.map((v: any) => `${v?.role}: ${v?.score}/5`).join('; ')}.`,
        strengths: allEvidence.slice(0, half).slice(0, 3),
        concerns: allEvidence.slice(half).slice(0, 3),
      };
    });

    // Follow-up questions
    const followUpQuestions: any[] = [];
    for (const gate of flaggedGates.slice(0, 3)) {
      followUpQuestions.push({
        question: `Can you provide more specific examples of your approach to ${gate.gate.replace(/_/g, ' ')}?`,
        targetGate: gate.gate,
        rationale: `This gate was flagged with evidence: ${gate.evidence.slice(0, 1).join('; ')}`,
      });
    }

    const lowDimensions = aggregatedDimensions.filter(d => d.score < 3.5).slice(0, 2);
    for (const dim of lowDimensions) {
      followUpQuestions.push({
        question: `Tell us about a specific example that demonstrates your ${DIMENSION_DISPLAY_NAMES[dim.dimension] || dim.dimension}.`,
        targetDimension: dim.dimension,
        rationale: `Pyramid score in this dimension is ${dim.score}/5.`,
      });
    }

    // Collect dissents
    const dissents = assessorVerdicts
      .filter((v: any) => v.dissent)
      .map((v: any) => ({ assessor: v.role, position: v.dissent }));

    // Final recommendation
    const chairRec = chairmanSynthesis.finalRecommendation || chairmanSynthesis.recommendation;
    const finalRecommendation = chairRec === 'hire' ? 'hire' : chairRec === 'cautious' || chairRec === 'cautious_below_bar' ? 'cautious_below_bar' : 'do_not_proceed';

    const report = {
      id: `report-${Date.now()}`,
      sessionId,
      candidateName,
      roleName,
      createdAt: new Date().toISOString(),

      gateBanner: {
        status: gateBannerStatus,
        message: gateBannerMessage,
        failedGates,
        flaggedGates,
      },

      caseAgainst: chairmanSynthesis.caseAgainst ||
        `The most significant concern is ${failedGates.length > 0 ? `failure of the ${failedGates[0].gate} gate` : `performance in ${aggregatedDimensions.filter(d => d.score < 3.5)[0]?.dimension || 'core dimensions'}`}.`,

      executiveSummary: chairmanSynthesis.executiveSummary || chairmanSynthesis.narrative ||
        `${candidateName} is a ${setup?.roleLevel || ''} candidate with demonstrated strengths in ${aggregatedDimensions.filter(d => d.score >= 4)[0]?.dimension || 'strategic thinking'}.`,

      pyramidScore: {
        overall: pyramidScoreValue,
        purityRating: `${Math.round(pyramidScoreValue * 20)}% Pure`,
        dimensions: aggregatedDimensions,
        deepSignals: [],
        hireBar: 4.0,
        meetsBar,
        characterClear,
        handsOnClear,
      },

      gateDetails: gateEvaluations,
      deepAssessment,

      raiseTheBar: chairmanSynthesis.raiseTheBar ||
        (meetsBar
          ? `Yes. This candidate's ${pyramidScoreValue.toFixed(2)}/5.0 score would elevate our organization.`
          : `No. The candidate's ${pyramidScoreValue.toFixed(2)}/5.0 score falls below the hire bar of 4.0.`),

      contextFit: `For a ${setup?.roleLevel || ''} ${roleName} role, ${candidateName}'s background shows ${meetsBar ? 'strong' : 'moderate'} alignment.`,

      assayInsight: chairmanSynthesis.assayInsight ||
        `Like ${pyramidScoreValue >= 4 ? 'a well-cut diamond' : 'raw ore'}, ${candidateName} has real potential but requires ${pyramidScoreValue >= 4.5 ? 'minimal' : pyramidScoreValue >= 4 ? 'some' : 'significant'} refinement before optimal performance.`,

      deliberation: {
        assessorVerdicts,
        chairmanSynthesis: chairmanSynthesis.narrative || chairmanSynthesis.executiveSummary || 'The assessor verdicts have been synthesized into this final recommendation.',
        dissents,
        finalRecommendation,
      },

      followUpQuestions,
      comparison: undefined,
    };

    return res.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

export default router;
