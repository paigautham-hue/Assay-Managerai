export type PyramidDimension =
  | 'domain_expertise'
  | 'hands_on_accountability'
  | 'character'
  | 'people_influence'
  | 'strategy_change'
  | 'motivation'
  | 'financial_fit';

export type DeepSignalDimension =
  | 'strategic_thinking'
  | 'execution_ability'
  | 'leadership_presence'
  | 'cultural_alignment'
  | 'emotional_intelligence'
  | 'domain_depth'
  | 'communication_clarity'
  | 'adaptability'
  | 'innovation_mindset';

export const DIMENSION_WEIGHTS: Record<PyramidDimension, number> = {
  domain_expertise: 0.20,
  hands_on_accountability: 0.20,
  character: 0.15,
  people_influence: 0.20,
  strategy_change: 0.10,
  motivation: 0.10,
  financial_fit: 0.05,
};

export const DIMENSION_DISPLAY_NAMES: Record<PyramidDimension, string> = {
  domain_expertise: 'Domain Expertise',
  hands_on_accountability: 'Hands-On & Accountability',
  character: 'Character (Good Person)',
  people_influence: 'People & Influence',
  strategy_change: 'Strategy & Change',
  motivation: 'Motivation & Alignment',
  financial_fit: 'Financial Fit',
};

export interface DimensionScore {
  dimension: PyramidDimension;
  score: number;
  weight: number;
  evidence: string[];
  assessorNotes: Record<string, string>;
}

export interface DeepSignalScore {
  signal: DeepSignalDimension;
  score: number;
  evidence: string[];
  parentDimensions: PyramidDimension[];
}

export interface DarkTriadScreening {
  narcissism: { score: number; markers: string[]; evidence: string[] };
  machiavellianism: { score: number; markers: string[]; evidence: string[] };
  psychopathy: { score: number; markers: string[]; evidence: string[] };
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
}

export interface DeceptionAnalysis {
  cognitiveLoadIndicators: string[];
  realityMonitoringFlags: string[];
  linguisticDeceptionMarkers: string[];
  consistencyViolations: string[];
  overallDeceptionRisk: 'low' | 'moderate' | 'high';
  confidenceScore: number;
}

export interface StressResponseProfile {
  baselineComposure: number;
  stressResilience: number;
  recoverySpeed: number;
  defenseMechanisms: string[];
  triggerTopics: string[];
  adaptiveStrategies: string[];
}

export interface PsychologicalScreening {
  darkTriad?: DarkTriadScreening;
  deception?: DeceptionAnalysis;
  stressProfile?: StressResponseProfile;
  clinicalFlags?: string[];
  counterproductiveWorkBehaviors?: string[];
  organizationalCitizenshipSignals?: string[];
}

export type CoreGate = 'integrity' | 'accountability' | 'harm_pattern' | 'context_misalignment';
export type OptionalGate = 'financial_fluency' | 'customer_orientation' | 'people_judgment' | 'decision_velocity' | 'technical_depth';
export type PsychologicalGate = 'covert_narcissism' | 'overconfidence_bias' | 'burnout_trajectory';
export type GateName = CoreGate | OptionalGate | PsychologicalGate;
export type GateConfidence = 'FAIL' | 'FLAG' | 'PASS' | 'INSUFFICIENT_DATA';

export interface GateEvaluation {
  gate: GateName;
  confidence: GateConfidence;
  isCore: boolean;
  evidence: string[];
  triggerDetails: string;
  assessorSource: string;
}

export type AssessorRole = 'advocate' | 'prosecutor' | 'psychologist' | 'operator' | 'culture_probe' | 'chairman';

export interface AssessorVerdict {
  role: AssessorRole;
  recommendation: 'hire' | 'no_hire' | 'cautious' | 'insufficient_data';
  confidence: number;
  narrative: string;
  dimensionScores: DimensionScore[];
  deepSignalScores?: DeepSignalScore[];
  psychologicalScreening?: PsychologicalScreening;
  gateEvaluations: GateEvaluation[];
  keyInsights: string[];
  dissent?: string;
}

export type { ProsodyData, ProsodyMetrics, EmotionDataPoint, SentimentSegment } from '../lib/emotionEngine';

export type InterviewMode = 'active' | 'shadow';
export type VoiceProvider = 'openai' | 'gemini' | 'xai';

export interface InterviewSetup {
  candidateName: string;
  roleName: string;
  roleLevel: 'C-Suite' | 'VP' | 'Director' | 'Senior Manager' | 'Manager';
  jobDescription: string;
  cvSummary: string;
  interviewMode: InterviewMode;
  activeGates: GateName[];
  customQuestions?: string[];
}

export interface InterviewSession {
  id: string;
  setup: InterviewSetup;
  status: 'preparing' | 'active' | 'completed' | 'error';
  startedAt?: string;
  endedAt?: string;
  transcript: TranscriptEntry[];
  observations: Observation[];
  voiceProvider: VoiceProvider;
  prosodyData?: import('../lib/emotionEngine').ProsodyData;
}

export interface TranscriptEntry {
  id: string;
  speaker: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  audioTimestamp?: number;
}

export interface Observation {
  id: string;
  type: 'red_flag' | 'strong_signal' | 'gate_signal' | 'score_signal';
  dimension?: PyramidDimension;
  gate?: GateName;
  description: string;
  evidence: string;
  confidence: number;
  timestamp: string;
}

export interface AssayReport {
  id: string;
  sessionId: string;
  candidateName: string;
  roleName: string;
  createdAt: string;

  gateBanner: {
    status: 'passed' | 'flagged' | 'failed';
    message: string;
    failedGates: GateEvaluation[];
    flaggedGates: GateEvaluation[];
  };

  caseAgainst: string;
  executiveSummary: string;

  pyramidScore: {
    overall: number;
    purityRating: string;
    dimensions: DimensionScore[];
    deepSignals: DeepSignalScore[];
    hireBar: number;
    meetsBar: boolean;
    characterClear: boolean;
    handsOnClear: boolean;
  };

  gateDetails: GateEvaluation[];

  deepAssessment: {
    dimension: PyramidDimension;
    narrative: string;
    strengths: string[];
    concerns: string[];
  }[];

  raiseTheBar: string;
  contextFit: string;
  assayInsight: string;

  deliberation: {
    assessorVerdicts: AssessorVerdict[];
    chairmanSynthesis: string;
    dissents: { assessor: string; position: string }[];
    finalRecommendation: 'hire' | 'do_not_proceed' | 'cautious_below_bar';
  };

  followUpQuestions: {
    question: string;
    targetGate?: GateName;
    targetDimension?: PyramidDimension;
    rationale: string;
  }[];

  comparison?: {
    candidates: { name: string; score: number; recommendation: string }[];
  };

  psychologicalProfile?: PsychologicalScreening;
  prosodyData?: import('../lib/emotionEngine').ProsodyData;
}
