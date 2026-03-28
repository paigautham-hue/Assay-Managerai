import type { GateName, GateEvaluation, GateConfidence, AssessorVerdict } from '../types';

export const GATE_DEFINITIONS: Record<GateName, {
  displayName: string;
  isCore: boolean;
  description: string;
  triggers: string[];
  detectionStrategy: string;
}> = {
  integrity: {
    displayName: 'Integrity',
    isCore: true,
    description: 'Contradictory accounts, fabricated credentials, inconsistency between stated and demonstrated values.',
    triggers: ['Contradictory accounts of the same event', 'Fabricated credentials or claims', 'Significant inconsistency between stated and demonstrated values', 'Ethical gray-zoning or rationalizing harm'],
    detectionStrategy: 'Cross-session consistency checking. Linguistic deception signals.',
  },
  accountability: {
    displayName: 'Accountability',
    isCore: true,
    description: 'Cannot produce a single specific example of owning a failure end-to-end.',
    triggers: ['Cannot name a specific personal failure owned end-to-end', 'Every mistake attributed to circumstances, teams, or others', 'Pattern of spectatorship rather than ownership'],
    detectionStrategy: 'Pronoun analysis: consistent "we" without "I" specifics.',
  },
  harm_pattern: {
    displayName: 'Harm Pattern',
    isCore: true,
    description: 'Punching down on subordinates. Rationalizing damage to others.',
    triggers: ['Punching down on subordinates', 'Rationalizing damage to others', 'Teams/orgs worse off after departure'],
    detectionStrategy: 'Empathy probing: how they describe people they let go.',
  },
  context_misalignment: {
    displayName: 'Context Misalignment',
    isCore: true,
    description: 'Career horizon fundamentally incompatible with role requirements.',
    triggers: ['Wants CEO in 18 months; role requires 5-year build', 'Wants stability; role is high-risk'],
    detectionStrategy: 'Direct probing: "What would make you leave this role in 18 months?"',
  },
  financial_fluency: {
    displayName: 'Financial Fluency',
    isCore: false,
    description: 'Cannot explain revenue-margin-EBITDA relationship for their own business.',
    triggers: ['Cannot articulate P&L mechanics', 'Technically brilliant but financially blind'],
    detectionStrategy: 'Direct questioning about business financial mechanics.',
  },
  customer_orientation: {
    displayName: 'Customer Orientation',
    isCore: false,
    description: 'Cannot name specific customers, conversion stages, or competitive dynamics.',
    triggers: ['Category-level knowledge without customer-level intelligence'],
    detectionStrategy: 'Ask for specific customer names, deal mechanics.',
  },
  people_judgment: {
    displayName: 'People Judgment',
    isCore: false,
    description: 'Cannot articulate how they assess talent, make firing decisions, or develop people.',
    triggers: ['Describes team outcomes without explaining team building'],
    detectionStrategy: 'Ask about hiring philosophy, worst hire, best development story.',
  },
  decision_velocity: {
    displayName: 'Decision Velocity',
    isCore: false,
    description: 'No evidence of fast decisions under uncertainty.',
    triggers: ['No evidence of directional decisions under uncertainty'],
    detectionStrategy: 'Ask for examples of decisions made with incomplete data.',
  },
  technical_depth: {
    displayName: 'Technical Depth',
    isCore: false,
    description: 'Cannot explain core technical architecture or make credible build-vs-buy arguments.',
    triggers: ['Management-layer fluency without builder-layer understanding'],
    detectionStrategy: 'Ask them to explain their product architecture.',
  },
  covert_narcissism: {
    displayName: 'Covert Narcissism',
    isCore: false,
    description: 'Pattern of grandiosity masked by false humility, entitlement disguised as standards, empathy deficits hidden behind charm.',
    triggers: ['Humble-bragging pattern', 'Victim narratives where they are always the misunderstood genius', 'Entitlement framed as having "high standards"'],
    detectionStrategy: 'Compare how they describe people who agree vs. disagree.',
  },
  overconfidence_bias: {
    displayName: 'Overconfidence Bias',
    isCore: false,
    description: 'Systematic overestimation of own abilities, dismissal of risk.',
    triggers: ['No failures acknowledged despite long career', 'All outcomes attributed to their judgment'],
    detectionStrategy: 'Ask about failures and near-misses.',
  },
  burnout_trajectory: {
    displayName: 'Burnout Trajectory',
    isCore: false,
    description: 'Signs of chronic depletion, cynicism about work, or joining to escape rather than build.',
    triggers: ['Cynicism about previous role/company', 'Emotional flatness when describing past achievements'],
    detectionStrategy: 'Listen for energy levels when discussing past vs. future work.',
  },
};

export const ROLE_GATE_PRESETS: Record<string, GateName[]> = {
  'CEO': ['financial_fluency', 'customer_orientation', 'people_judgment', 'decision_velocity', 'covert_narcissism', 'overconfidence_bias'],
  'CFO': ['financial_fluency', 'overconfidence_bias'],
  'CTO': ['technical_depth', 'people_judgment', 'covert_narcissism'],
  'VP Engineering': ['technical_depth', 'people_judgment', 'covert_narcissism', 'burnout_trajectory'],
  'COO': ['financial_fluency', 'people_judgment', 'decision_velocity', 'burnout_trajectory'],
};

export function evaluateGates(verdicts: AssessorVerdict[]): {
  overallStatus: 'passed' | 'flagged' | 'failed';
  evaluations: GateEvaluation[];
} {
  const gateMap = new Map<GateName, GateEvaluation[]>();

  for (const verdict of verdicts) {
    for (const gate of verdict.gateEvaluations) {
      if (!gateMap.has(gate.gate)) gateMap.set(gate.gate, []);
      gateMap.get(gate.gate)!.push(gate);
    }
  }

  const evaluations: GateEvaluation[] = [];
  for (const [gateName, evals] of gateMap) {
    const def = GATE_DEFINITIONS[gateName];
    const hasFail = evals.some(e => e.confidence === 'FAIL');
    const hasFlag = evals.some(e => e.confidence === 'FLAG');
    const hasInsufficient = evals.every(e => e.confidence === 'INSUFFICIENT_DATA');

    let finalConfidence: GateConfidence;
    if (hasFail) finalConfidence = 'FAIL';
    else if (hasFlag) finalConfidence = 'FLAG';
    else if (hasInsufficient) finalConfidence = 'INSUFFICIENT_DATA';
    else finalConfidence = 'PASS';

    const allEvidence = evals.flatMap(e => e.evidence);
    const sources = evals.map(e => e.assessorSource).join(', ');

    evaluations.push({
      gate: gateName,
      confidence: finalConfidence,
      isCore: def?.isCore ?? false,
      evidence: allEvidence,
      triggerDetails: evals.find(e => e.triggerDetails)?.triggerDetails || '',
      assessorSource: sources,
    });
  }

  const coreGateEvals = evaluations.filter(e => e.isCore);
  const hasCoreFailure = coreGateEvals.some(e => e.confidence === 'FAIL');
  const hasAnyFlag = evaluations.some(e => e.confidence === 'FLAG');

  const overallStatus = hasCoreFailure ? 'failed' : hasAnyFlag ? 'flagged' : 'passed';

  return { overallStatus, evaluations };
}

export function calculatePyramidScore(
  dimensionScores: Record<string, { score: number; weight: number }>,
): {
  overall: number;
  meetsBar: boolean;
  characterClear: boolean;
  handsOnClear: boolean;
} {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const dim of Object.values(dimensionScores)) {
    weightedSum += dim.score * dim.weight;
    totalWeight += dim.weight;
  }

  const overall = totalWeight > 0 ? weightedSum / totalWeight : 0;

  const characterScore = (dimensionScores as any)['character']?.score ?? 2.5;
  const handsOnScore = (dimensionScores as any)['hands_on_accountability']?.score ?? 2.5;
  const characterClear = characterScore >= 3.0;
  const handsOnClear = handsOnScore >= 3.0;
  const meetsBar = overall >= 4.0 && characterClear && handsOnClear;

  return {
    overall: Math.round(overall * 100) / 100,
    meetsBar,
    characterClear,
    handsOnClear,
  };
}
