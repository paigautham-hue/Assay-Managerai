import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { buildReport } from '../lib/reportBuilder.js';

const router = Router();

interface AssessorConfig {
  role: string;
  displayName: string;
  model: string;
  provider: 'anthropic' | 'openai' | 'google';
  systemPrompt: string;
}

const ASSESSOR_CONFIGS: AssessorConfig[] = [
  {
    role: 'advocate',
    displayName: 'The Advocate',
    model: 'claude-opus-4-5',
    provider: 'anthropic',
    systemPrompt: `You are The Advocate in the ASSAY interview assessment chamber. Find the BEST case for this candidate.
NORTH STAR: "Avoid future problems." Identify genuine strengths that predict future success.
MANDATE: Find genuine strengths with SPECIFIC evidence. Score generously where evidence exists. EVIDENCE > ADJECTIVES.
PYRAMID V2 (score 1-5): 1.DOMAIN_EXPERTISE(20%) 2.HANDS_ON_ACCOUNTABILITY(20%) 3.CHARACTER(15%) 4.PEOPLE_INFLUENCE(20%) 5.STRATEGY_CHANGE(10%) 6.MOTIVATION(10%) 7.FINANCIAL_FIT(5%)
DEEP SIGNALS: strategic_thinking, execution_ability, leadership_presence, cultural_alignment, emotional_intelligence, domain_depth, communication_clarity, adaptability, innovation_mindset
Output valid JSON only.`,
  },
  {
    role: 'prosecutor',
    displayName: 'The Prosecutor',
    model: 'claude-opus-4-5',
    provider: 'anthropic',
    systemPrompt: `You are The Prosecutor in the ASSAY interview assessment chamber. Stress-test claims and find cracks.
NORTH STAR: "Avoid future problems." You are the last line of defense against a bad hire.
MANDATE: Start with "Why should we REJECT this candidate?" Flag inconsistencies, vague answers, and evasions.
GATES (CRITICAL): integrity, accountability, harm_pattern, context_misalignment
DECEPTION DETECTION: cross-story consistency, specificity gradient, pronoun forensics (I vs we), omissions, rehearsal vs recall
PYRAMID V2 (score conservatively): same 7 dimensions. Score ≥3 only with strong evidence.
Include psychologicalScreening.deception analysis.
Output valid JSON only.`,
  },
  {
    role: 'psychologist',
    displayName: 'The Psychologist',
    model: 'gpt-4o',
    provider: 'openai',
    systemPrompt: `You are The Psychologist in the ASSAY interview assessment chamber. Read beneath the surface.
NORTH STAR: "Avoid future problems." The most dangerous hires interview brilliantly but create chaos inside.
DARK TRIAD (score 0-10 each): narcissism (overt+covert), machiavellianism, psychopathy (subclinical). Score ≥6=FLAG, ≥8=FAIL.
DECEPTION: cognitive load theory, reality monitoring (sensory/emotional detail), linguistic forensics (pronoun ratios, hedging).
STRESS PROFILE: baseline composure, resilience, recovery speed, defense mechanisms, trigger topics.
CLINICAL FLAGS: covert narcissism, borderline traits, antisocial patterns (note: patterns, not diagnoses).
PYRAMID V2: evaluate HOW they communicate, not just WHAT they say.
Include full psychologicalScreening object.
Output valid JSON only.`,
  },
  {
    role: 'operator',
    displayName: 'The Operator',
    model: 'claude-opus-4-5',
    provider: 'anthropic',
    systemPrompt: `You are The Operator in the ASSAY interview assessment chamber. Evaluate execution reality.
NORTH STAR: "Avoid future problems." Find the gap between strategy talk and execution reality.
BUILDER TEST: Can they describe THE ARTIFACT (the specific thing built)? THE HARD DAY? THE LEARNING LOOP? THE MEASUREMENT?
ARMCHAIR QUARTERBACK ANTI-PATTERN: lots of strategy + lots of "we" + vague contribution + no artifacts = spectator.
PRIMARY FOCUS: HANDS_ON_ACCOUNTABILITY - no red flags allowed for hire bar.
FINANCIAL FLUENCY gate: unit economics, CAC, margin structure.
DECISION VELOCITY gate: fast decisions under uncertainty with incomplete data.
TECHNICAL DEPTH gate: architecture depth, build vs buy arguments.
PYRAMID V2: score all 7 dimensions with operational lens.
Output valid JSON only.`,
  },
  {
    role: 'culture_probe',
    displayName: 'The Culture Probe',
    model: 'gemini-2.0-flash',
    provider: 'google',
    systemPrompt: `You are The Culture Probe in the ASSAY interview assessment chamber. Detect whether this person will ELEVATE or CORRODE the culture.
NORTH STAR: "Avoid future problems." Culture corrosion is slow, invisible, and catastrophic.
CULTURE MULTIPLIERS: shares expertise generously, models accountability publicly, gives credit / takes blame, develops people who go on to build great cultures.
CULTURE CORROSION RED FLAGS: describes past orgs as "toxic" without self-reflection, zero people development stories, contempt language, credit hogging, "high performers need to be hungry."
PRIMARY FOCUS: CHARACTER dimension + HARM_PATTERN gate.
PEOPLE_JUDGMENT gate: hiring philosophy, worst hire, best development story.
COVERT_NARCISSISM gate: cultural narcissists are the most destructive possible hires.
PYRAMID V2: score all 7 dimensions with culture lens.
Output valid JSON only.`,
  },
];

const ASSESSOR_JSON_SCHEMA = `{
  "recommendation": "hire" | "no_hire" | "cautious" | "insufficient_data",
  "confidence": 0.0-1.0,
  "narrative": "paragraph summarizing your assessment",
  "dimensionScores": [
    {
      "dimension": "domain_expertise" | "hands_on_accountability" | "character" | "people_influence" | "strategy_change" | "motivation" | "financial_fit",
      "score": 1-5,
      "weight": (use: domain_expertise=0.20, hands_on_accountability=0.20, character=0.15, people_influence=0.20, strategy_change=0.10, motivation=0.10, financial_fit=0.05),
      "evidence": ["specific quote or observation"],
      "assessorNotes": {}
    }
  ],
  "deepSignalScores": [
    {
      "signal": "strategic_thinking" | "execution_ability" | "leadership_presence" | "cultural_alignment" | "emotional_intelligence" | "domain_depth" | "communication_clarity" | "adaptability" | "innovation_mindset",
      "score": 1-5,
      "evidence": ["specific evidence"],
      "parentDimensions": ["domain_expertise"]
    }
  ],
  "gateEvaluations": [
    {
      "gate": "integrity" | "accountability" | "harm_pattern" | "context_misalignment" | "financial_fluency" | "customer_orientation" | "people_judgment" | "decision_velocity" | "technical_depth" | "covert_narcissism" | "overconfidence_bias" | "burnout_trajectory",
      "confidence": "FAIL" | "FLAG" | "PASS" | "INSUFFICIENT_DATA",
      "isCore": true/false,
      "evidence": ["supporting evidence"],
      "triggerDetails": "explanation"
    }
  ],
  "keyInsights": ["insight1", "insight2"],
  "dissent": "optional disagreement with consensus"
}`;

async function callAnthropic(config: AssessorConfig, transcriptText: string, setupContext: string): Promise<any> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
  const userPrompt = buildUserPrompt(config.displayName, transcriptText, setupContext);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: config.model, max_tokens: 8000, system: config.systemPrompt, messages: [{ role: 'user', content: userPrompt }] }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Anthropic API error ${res.status}: ${err.substring(0, 200)}`); }
  const data = await res.json();
  return extractJSON(data.content[0]?.text || '');
}

async function callOpenAI(config: AssessorConfig, transcriptText: string, setupContext: string): Promise<any> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');
  const userPrompt = buildUserPrompt(config.displayName, transcriptText, setupContext);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: config.model, max_tokens: 8000, messages: [{ role: 'system', content: config.systemPrompt }, { role: 'user', content: userPrompt }] }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`OpenAI API error ${res.status}: ${err.substring(0, 200)}`); }
  const data = await res.json();
  return extractJSON(data.choices[0]?.message?.content || '');
}

async function callGoogle(config: AssessorConfig, transcriptText: string, setupContext: string): Promise<any> {
  if (!process.env.GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not configured');
  const userPrompt = buildUserPrompt(config.displayName, transcriptText, setupContext);
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: { text: config.systemPrompt } }, contents: { parts: [{ text: userPrompt }] }, generationConfig: { maxOutputTokens: 8000 } }),
    }
  );
  if (!res.ok) { const err = await res.text(); throw new Error(`Google API error ${res.status}: ${err.substring(0, 200)}`); }
  const data = await res.json();
  return extractJSON(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
}

function buildUserPrompt(displayName: string, transcriptText: string, setupContext: string): string {
  return `## Interview Transcript\n${transcriptText}\n\n## Interview Setup\n${setupContext}\n\n## Your Task\nAnalyze this interview transcript as ${displayName}. Evaluate the candidate across all 7 Pyramid dimensions and relevant Non-Negotiable Gates.\n\nReturn your assessment as valid JSON ONLY (no markdown, no explanation) matching this structure:\n${ASSESSOR_JSON_SCHEMA}\n\nIMPORTANT: Score ALL 7 pyramid dimensions. Be rigorous. Be honest. Base all scores on evidence from the transcript.`;
}

function extractJSON(text: string): any {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in response');
  return JSON.parse(match[0]);
}

async function callAssessor(config: AssessorConfig, transcriptText: string, setupContext: string): Promise<any> {
  if (config.provider === 'anthropic') return callAnthropic(config, transcriptText, setupContext);
  if (config.provider === 'openai') return callOpenAI(config, transcriptText, setupContext);
  if (config.provider === 'google') return callGoogle(config, transcriptText, setupContext);
  throw new Error(`Unknown provider: ${config.provider}`);
}

async function callAssessorWithFallback(
  config: AssessorConfig,
  transcriptText: string,
  setupContext: string
): Promise<{ verdict: any } | { error: string }> {
  const fallbacks: AssessorConfig[] = [
    config,
    { ...config, model: 'claude-3-5-sonnet-20241022', provider: 'anthropic' },
    { ...config, model: 'gpt-4o', provider: 'openai' },
  ];
  let lastError = '';
  for (const fallbackConfig of fallbacks) {
    try {
      const response = await callAssessor(fallbackConfig, transcriptText, setupContext);
      const verdict = {
        role: config.role,
        recommendation: response.recommendation || 'insufficient_data',
        confidence: response.confidence || 0.5,
        narrative: response.narrative || '',
        dimensionScores: (response.dimensionScores || []).map((ds: any) => ({ dimension: ds.dimension, score: ds.score, weight: ds.weight, evidence: ds.evidence || [], assessorNotes: ds.assessorNotes || {} })),
        deepSignalScores: (response.deepSignalScores || []).map((ds: any) => ({ signal: ds.signal, score: ds.score, evidence: ds.evidence || [], parentDimensions: ds.parentDimensions || [] })),
        psychologicalScreening: response.psychologicalScreening,
        gateEvaluations: (response.gateEvaluations || []).map((ge: any) => ({ gate: ge.gate, confidence: ge.confidence, isCore: ge.isCore, evidence: ge.evidence || [], triggerDetails: ge.triggerDetails || '', assessorSource: config.displayName })),
        keyInsights: response.keyInsights || [],
        dissent: response.dissent,
      };
      return { verdict };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`Assessor ${config.role} failed with ${fallbackConfig.model}: ${lastError}`);
    }
  }
  return { error: `${config.role} failed after all fallbacks: ${lastError}` };
}

async function callChairman(verdicts: any[], transcriptText: string, setupContext: string): Promise<any> {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
    return {
      recommendation: verdicts.filter(v => v.recommendation === 'hire').length > verdicts.length / 2 ? 'hire' : 'no_hire',
      confidence: verdicts.reduce((sum, v) => sum + v.confidence, 0) / verdicts.length,
      narrative: `Based on ${verdicts.length} assessor verdicts.`,
      executiveSummary: `Synthesized from ${verdicts.length} specialized assessor perspectives.`,
    };
  }

  const verdictsText = verdicts.map(v => `${v.role.toUpperCase()} (${v.recommendation}, ${(v.confidence * 100).toFixed(0)}% confidence):\n${v.narrative}`).join('\n\n');
  const prompt = `You are The Chairman of the ASSAY assessment chamber. Synthesize these ${verdicts.length} assessor verdicts into a final recommendation.\n\nASSESSOR VERDICTS:\n${verdictsText}\n\nINTERVIEW SETUP:\n${setupContext}\n\nPYRAMID BAR: hire requires ≥4.0/5.0 overall, no critical red flags in Character or Hands-On.\n\nReturn JSON only:\n{"recommendation":"hire"|"cautious"|"no_hire","confidence":0.0-1.0,"narrative":"synthesis paragraph","executiveSummary":"2-3 sentence executive summary","caseAgainst":"strongest case against hiring","raiseTheBar":"would this hire raise the bar?","assayInsight":"metaphorical insight about this candidate","finalRecommendation":"hire"|"cautious_below_bar"|"do_not_proceed","keyInsights":["key1","key2"]}`;

  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'claude-3-5-sonnet-20241022', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
      });
      if (res.ok) return extractJSON((await res.json()).content[0]?.text || '');
    }
    if (process.env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
      });
      if (res.ok) return extractJSON((await res.json()).choices[0]?.message?.content || '');
    }
  } catch (err) { console.error('Chairman synthesis error:', err); }

  return {
    recommendation: verdicts.filter(v => v.recommendation === 'hire').length > verdicts.length / 2 ? 'hire' : 'no_hire',
    confidence: verdicts.reduce((sum, v) => sum + v.confidence, 0) / verdicts.length,
    narrative: `Based on ${verdicts.length} assessor verdicts.`,
    executiveSummary: `Synthesized from ${verdicts.length} specialized assessor perspectives.`,
  };
}

function prepareTranscriptContext(transcript: any[], setup: any) {
  const transcriptText = transcript.length > 0
    ? transcript.map((e: any) => `[${e.timestamp}] ${e.speaker.toUpperCase()}: ${e.text}`).join('\n')
    : '[No transcript recorded - candidate may not have spoken during interview]';

  const setupContext = `Candidate: ${setup.candidateName}
Role: ${setup.roleName} (${setup.roleLevel || ''})
Job Description: ${setup.jobDescription || 'Not provided'}
CV Summary: ${setup.cvSummary || 'Not provided'}
Interview Mode: ${setup.interviewMode}
Active Gates: ${setup.activeGates?.join(', ') || 'standard gates'}`;

  return { transcriptText, setupContext };
}

// Legacy synchronous endpoint (kept for backward compat)
router.post('/assess', async (req: Request, res: Response) => {
  try {
    const { transcript, setup, observations } = req.body;
    if (!transcript || !Array.isArray(transcript)) return res.status(400).json({ error: 'transcript array is required' });
    if (!setup) return res.status(400).json({ error: 'setup is required' });

    const { transcriptText, setupContext } = prepareTranscriptContext(transcript, setup);

    const results = await Promise.allSettled(ASSESSOR_CONFIGS.map(config => callAssessorWithFallback(config, transcriptText, setupContext)));
    const verdicts: any[] = [];
    const failures: string[] = [];

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        if ('verdict' in result.value) verdicts.push(result.value.verdict);
        else { failures.push(result.value.error); console.error(`Assessor ${ASSESSOR_CONFIGS[i].role} failed:`, result.value.error); }
      } else {
        failures.push(`${ASSESSOR_CONFIGS[i].role}: ${result.reason}`);
      }
    });

    if (verdicts.length === 0) return res.status(500).json({ error: 'All assessors failed', details: failures });
    const chairmanSynthesis = await callChairman(verdicts, transcriptText, setupContext);
    return res.json({ verdicts, chairmanSynthesis, failedAssessors: failures.length > 0 ? failures : undefined });
  } catch (error) {
    console.error('Assessment error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

// Streaming SSE endpoint - sends real-time progress as each assessor completes
router.post('/assess/stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (event: string, data: object) => {
    try {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      // Client disconnected
    }
  };

  try {
    const { transcript, setup, observations, sessionId, prosodyData } = req.body;

    if (!transcript || !Array.isArray(transcript) || !setup) {
      sendEvent('error', { message: 'transcript and setup are required' });
      res.end();
      return;
    }

    const { transcriptText, setupContext } = prepareTranscriptContext(transcript, setup);

    sendEvent('start', { sessionId, assessorCount: ASSESSOR_CONFIGS.length });

    const verdicts: any[] = [];
    const errors: string[] = [];

    // Start all assessors in parallel — stream events as each completes
    const assessorPromises = ASSESSOR_CONFIGS.map(async (config, index) => {
      const startedAt = Date.now();
      sendEvent('assessor_start', { role: config.role, displayName: config.displayName, index });

      const result = await callAssessorWithFallback(config, transcriptText, setupContext);
      const duration = Date.now() - startedAt;

      if ('verdict' in result) {
        verdicts.push(result.verdict);

        // Save verdict to DB (best effort)
        if (sessionId) {
          prisma.assessorVerdict.create({
            data: {
              sessionId,
              role: result.verdict.role,
              recommendation: result.verdict.recommendation,
              confidence: result.verdict.confidence,
              narrative: result.verdict.narrative,
              dimensionScores: result.verdict.dimensionScores,
              deepSignalScores: result.verdict.deepSignalScores ?? null,
              psychologicalScreening: result.verdict.psychologicalScreening ?? null,
              gateEvaluations: result.verdict.gateEvaluations,
              keyInsights: result.verdict.keyInsights,
              dissent: result.verdict.dissent ?? null,
            },
          }).catch(err => console.warn('Failed to save verdict to DB:', err));
        }

        sendEvent('assessor_complete', { role: config.role, displayName: config.displayName, index, duration });
      } else {
        errors.push(result.error);
        console.error(`Assessor ${config.role} failed:`, result.error);
        sendEvent('assessor_error', { role: config.role, displayName: config.displayName, index, duration, error: result.error });
      }
    });

    await Promise.allSettled(assessorPromises);

    if (verdicts.length === 0) {
      sendEvent('error', { message: 'All assessors failed', details: errors });
      res.end();
      return;
    }

    // Chairman synthesis
    const chairmanStart = Date.now();
    sendEvent('chairman_start', { index: 5 });
    const chairmanSynthesis = await callChairman(verdicts, transcriptText, setupContext);
    sendEvent('chairman_complete', { duration: Date.now() - chairmanStart });

    // Build report
    const report = buildReport({
      sessionId: sessionId || `session-${Date.now()}`,
      candidateName: setup.candidateName,
      roleName: setup.roleName,
      assessorVerdicts: verdicts,
      chairmanSynthesis,
      setup,
      prosodyData: prosodyData ?? undefined,
    });

    // Save report to DB (best effort)
    if (sessionId) {
      prisma.report.upsert({
        where: { id: report.id },
        create: { id: report.id, sessionId, candidateName: setup.candidateName, roleName: setup.roleName, reportData: report as any },
        update: { reportData: report as any },
      }).catch(err => console.warn('Failed to save report to DB:', err));
    }

    sendEvent('report_complete', { reportId: report.id, report });
    res.end();
  } catch (error) {
    console.error('Streaming assessment error:', error);
    sendEvent('error', { message: error instanceof Error ? error.message : 'Internal server error' });
    res.end();
  }
});

export default router;
