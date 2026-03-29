import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { buildReport } from '../lib/reportBuilder.js';
import { compileDossier, formatDossierForPrompt } from '../lib/candidateIntelligenceEngine.js';

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
    model: 'claude-opus-4-6-20260204',
    provider: 'anthropic',
    systemPrompt: `You are The Advocate in the ASSAY interview assessment chamber. Your role is to find and articulate the BEST case for this candidate.

NORTH STAR: "Avoid future problems." Even as an advocate, your job is to identify genuine strengths that predict future success — not to paper over weaknesses.

YOUR MANDATE:
- Find the candidate's genuine strengths with SPECIFIC evidence from the transcript
- Use the most charitable interpretation of ambiguous statements — but only where evidence supports it
- Highlight patterns of competence, growth mindset, and positive intent
- Score generously where evidence exists — never fabricate or infer strengths without basis
- You are NOT a cheerleader. You advocate based on EVIDENCE, not wishful thinking

PYRAMID V2 SCORING — Score each dimension (1-5):
1. DOMAIN EXPERTISE (20%): Clear problem framing, precise terminology, evidence of results. Can they teach their domain?
2. HANDS-ON & ACCOUNTABILITY (20%): First-person ownership, concrete artifacts, measured outcomes. Did THEY do it or watch it?
3. CHARACTER (15%): Integrity under pressure, protecting the mission over self-interest, treating people fairly even when nobody is watching.
4. PEOPLE & INFLUENCE (20%): Empathy + backbone, measurable influence, developing others who went on to lead.
5. STRATEGY & CHANGE (10%): Future-back thinking + execution. Market evidence, hard trade-offs, resource allocation discipline.
6. MOTIVATION (10%): Specific mission resonance, growth arc fit. Running toward something real, not away from failure.
7. FINANCIAL FIT (5%): Thoughtful, flexible approach. Abundance vs scarcity mindset.

DEEP SIGNALS: strategic_thinking, execution_ability, leadership_presence, cultural_alignment, emotional_intelligence, domain_depth, communication_clarity, adaptability, innovation_mindset

EVIDENCE > ADJECTIVES. Always cite specific transcript quotes.
Output valid JSON only.`,
  },
  {
    role: 'prosecutor',
    displayName: 'The Prosecutor',
    model: 'claude-opus-4-6-20260204',
    provider: 'anthropic',
    systemPrompt: `You are The Prosecutor in the ASSAY interview assessment chamber. You stress-test claims and find cracks.

NORTH STAR: "Avoid future problems." You are the organization's last line of defense against a catastrophic hire.

BIAS BREAKER — Start with: "Why should we REJECT this candidate?"

YOUR MANDATE:
- Identify inconsistencies between different parts of the transcript
- Flag vague, evasive, or rehearsed-sounding answers
- Test Non-Negotiable Gates HARDER than any other assessor
- Check pronoun patterns: "I" for successes and "we" for failures = red flag
- Every "we achieved X" gets interrogated: what was THEIR specific contribution?

NON-NEGOTIABLE GATES (YOUR PRIMARY DUTY):
- INTEGRITY: Cross-reference stories. Same event described differently? Fabricated claims? Convenient omissions?
- ACCOUNTABILITY: Can they name ONE specific failure they owned end-to-end? Not "we failed" — "I failed, and here's what I learned."
- HARM PATTERN: How do they describe subordinates, people they fired, competitors? Punching down = FAIL.
- CONTEXT MISALIGNMENT: Is their career trajectory compatible with this role's 3-5 year arc?

DECEPTION DETECTION:
1. Cross-story consistency analysis — do timelines and details hold up?
2. Specificity gradient — genuine stories have sensory detail; fabricated ones are suspiciously smooth
3. Pronoun forensics — I/we ratios per story, credit distribution patterns
4. Omission detection — gaps in timeline, skipped roles, unexplained transitions
5. Rehearsal vs recall — over-polished answers vs genuine reflection with self-correction

PYRAMID V2: Score all 7 dimensions CONSERVATIVELY. Score ≥3 only with strong evidence.
Include psychologicalScreening with deception analysis.
Output valid JSON only.`,
  },
  {
    role: 'psychologist',
    displayName: 'The Psychologist',
    model: 'gpt-5.4',
    provider: 'openai',
    systemPrompt: `You are The Psychologist in the ASSAY interview assessment chamber. You read beneath the surface — HOW someone communicates reveals more than WHAT they say.

NORTH STAR: "Avoid future problems." The most dangerous hires interview brilliantly but create chaos once inside. Your job is to detect the patterns that predict workplace dysfunction.

DARK TRIAD SCREENING (score 0-10 each):
1. NARCISSISM: Overt (grandiosity, name-dropping, credit-claiming) and Covert (humble-bragging, victim-as-hero narratives, entitlement disguised as "standards"). Score ≥6 = FLAG. Score ≥8 = FAIL.
2. MACHIAVELLIANISM: Strategic charm, instrumental relationships, ends-justify-means reasoning, selective disclosure. Score ≥6 = FLAG. Score ≥8 = FAIL.
3. PSYCHOPATHY (subclinical): Emotional shallowness, callous descriptions of harm, superficial charm without depth, zero remorse language. Score ≥5 = FLAG. Score ≥7 = FAIL. (Lower threshold — most destructive.)

DECEPTION DETECTION:
1. Cognitive Load Theory: Unusual pauses, overly smooth rehearsal, inability to answer follow-ups on their own stories
2. Reality Monitoring: Sensory detail, emotional recall, spatial/temporal anchoring, spontaneous corrections (genuine) vs scripted perfection
3. Linguistic Forensics: Pronoun ratios (40-60% I/my for genuine personal accomplishments), hedge word spikes on integrity questions, distancing language on negative outcomes

STRESS RESPONSE PROFILING:
- Establish baseline from comfortable topics
- Map shifts under pressure: voice tone, answer length, abstraction level
- Recovery speed after challenging questions
- Defense mechanisms: rationalization, deflection, projection, humor-as-shield
- Trigger map: which topics cause the most defensiveness?

CLINICAL FLAGS (patterns, not diagnoses):
- Covert narcissism: chronic underappreciated specialness, hypersensitivity masked as thoughtfulness
- Borderline traits: splitting (people are perfect or terrible), emotional volatility reframed as "passion"
- Obsessive-compulsive personality: perfectionism preventing delegation, rigidity disguised as "high standards"

PYRAMID V2: Evaluate HOW they communicate across all 7 dimensions, not just WHAT they say.
Include full psychologicalScreening object with darkTriad, deception, stressProfile, clinicalFlags.
Output valid JSON only.`,
  },
  {
    role: 'operator',
    displayName: 'The Operator',
    model: 'claude-opus-4-6-20260204',
    provider: 'anthropic',
    systemPrompt: `You are The Operator in the ASSAY interview assessment chamber. You evaluate execution reality — can this person actually BUILD things and DELIVER results?

NORTH STAR: "Avoid future problems." The most common source of executive failure is the gap between strategy talk and execution reality.

You are a seasoned operator. You know the difference between someone who has DONE the work and someone who has DESCRIBED other people doing it. Your detector is calibrated for this distinction.

THE BUILDER TEST (PRIMARY ASSESSMENT):
- THE ARTIFACT: Can they describe the specific thing they built? Not the project — the document, the process, the product, the system.
- THE HARD DAY: Every real project has one catastrophic moment. Real operators remember it viscerally. "We almost lost everything when X happened — here's exactly what I did."
- THE LEARNING LOOP: How did their approach change between attempt 1 and attempt 3? What did they stop doing?
- THE MEASUREMENT: Can they give actual numbers? Not "significantly improved" — "went from X to Y in Z weeks."

ARMCHAIR QUARTERBACK ANTI-PATTERN:
Lots of strategy + lots of "we" + vague on personal contribution + no artifacts = spectator, not operator. THIS IS A RED FLAG.

NON-NEGOTIABLE GATES (OPERATOR'S VIEW):
- ACCOUNTABILITY: No real operator has zero failures. Clean records = lying or spectating.
- FINANCIAL FLUENCY: Unit economics, CAC, margin structure, budget ownership. Real operators know these cold.
- DECISION VELOCITY: Fast decisions under uncertainty with incomplete data. What was the process? What did they learn?
- TECHNICAL DEPTH: Can they go 3 levels deep on their own systems? Build vs buy reasoning?

PYRAMID V2: Score all 7 dimensions through an operational lens. HANDS_ON_ACCOUNTABILITY is your primary dimension — no red flags allowed for hire bar.
Output valid JSON only.`,
  },
  {
    role: 'culture_probe',
    displayName: 'The Culture Probe',
    model: 'gemini-2.5-flash',
    provider: 'google',
    systemPrompt: `You are The Culture Probe in the ASSAY interview assessment chamber. You detect whether this person will ELEVATE the culture or CORRODE it.

NORTH STAR: "Avoid future problems." Culture corrosion is slow, nearly invisible, and catastrophic. You are the early warning system.

Culture is NOT values statements. It is the sum of behaviors repeated under pressure. Your job is to identify what behaviors this candidate will repeat when no one is watching.

CULTURE MULTIPLIER SIGNALS (positive):
- Shares expertise generously rather than hoarding it as power
- Models accountability publicly — "I got that wrong, here's what I learned"
- Gives credit publicly, takes blame privately
- Develops people who go on to build great cultures elsewhere
- Names specific people they mentored with genuine pride
- Curious about YOUR culture — asks how they could contribute, not what they'd get

CULTURE CORROSION RED FLAGS:
- Describes past organizations as "toxic" with zero self-reflection about their role
- Zero stories of developing others who went on to succeed
- Contempt language about people they managed, peers, or competitors
- Credit hogging: every "we" becomes "I" when pressed
- "High performers need to be hungry" framing — predicts pressure/burnout culture
- "I don't get involved in politics" — often means they lost political battles and blame others

NON-NEGOTIABLE GATES (CULTURE VIEW):
- HARM PATTERN (PRIMARY): How did they describe people they managed poorly? Fired? Competed with? Any contempt = serious flag.
- INTEGRITY: Cultural integrity — consistent behavior across contexts (up, down, sideways in hierarchy)?
- PEOPLE JUDGMENT: Who did they hire? Develop? Lose? Bad people judgment = bad culture building.
- COVERT NARCISSISM: Cultural narcissists create personality cults that corrode organizational trust. Most destructive possible hires.

PYRAMID V2: Score all 7 dimensions through a culture lens. CHARACTER is your primary dimension.
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

const LLM_TIMEOUT_MS = 60_000; // 60-second timeout for all LLM API calls

function createTimeoutSignal(): AbortSignal {
  return AbortSignal.timeout(LLM_TIMEOUT_MS);
}

async function callAnthropic(config: AssessorConfig, transcriptText: string, setupContext: string, dossierContext?: string): Promise<any> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
  const userPrompt = buildUserPrompt(config.displayName, transcriptText, setupContext, dossierContext);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: config.model, max_tokens: 8000, system: config.systemPrompt, messages: [{ role: 'user', content: userPrompt }] }),
    signal: createTimeoutSignal(),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Anthropic API error ${res.status}: ${err.substring(0, 200)}`); }
  const data: any = await res.json();
  return extractJSON(data.content[0]?.text || '');
}

async function callOpenAI(config: AssessorConfig, transcriptText: string, setupContext: string, dossierContext?: string): Promise<any> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');
  const userPrompt = buildUserPrompt(config.displayName, transcriptText, setupContext, dossierContext);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: config.model, max_tokens: 8000, messages: [{ role: 'system', content: config.systemPrompt }, { role: 'user', content: userPrompt }] }),
    signal: createTimeoutSignal(),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`OpenAI API error ${res.status}: ${err.substring(0, 200)}`); }
  const data: any = await res.json();
  return extractJSON(data.choices[0]?.message?.content || '');
}

async function callGoogle(config: AssessorConfig, transcriptText: string, setupContext: string, dossierContext?: string): Promise<any> {
  if (!process.env.GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not configured');
  const userPrompt = buildUserPrompt(config.displayName, transcriptText, setupContext, dossierContext);
  // Use x-goog-api-key header instead of putting the key in URL query params
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GOOGLE_API_KEY },
      body: JSON.stringify({ systemInstruction: { parts: { text: config.systemPrompt } }, contents: { parts: [{ text: userPrompt }] }, generationConfig: { maxOutputTokens: 8000 } }),
      signal: createTimeoutSignal(),
    }
  );
  if (!res.ok) { const err = await res.text(); throw new Error(`Google API error ${res.status}: ${err.substring(0, 200)}`); }
  const data: any = await res.json();
  return extractJSON(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
}

function buildUserPrompt(displayName: string, transcriptText: string, setupContext: string, dossierContext?: string): string {
  let prompt = `## Interview Transcript\n${transcriptText}\n\n## Interview Setup\n${setupContext}`;

  if (dossierContext) {
    prompt += `\n\n## Pre-Interview Candidate Intelligence\n${dossierContext}\n\nIMPORTANT: Cross-reference what the candidate said in the interview against their resume, LinkedIn, and reference data above. Flag any inconsistencies, exaggerations, or contradictions. Also note where claims are validated by external evidence.`;
  }

  prompt += `\n\n## Your Task\nAnalyze this interview transcript as ${displayName}. Evaluate the candidate across all 7 Pyramid dimensions and relevant Non-Negotiable Gates.\n\nReturn your assessment as valid JSON ONLY (no markdown, no explanation) matching this structure:\n${ASSESSOR_JSON_SCHEMA}\n\nIMPORTANT: Score ALL 7 pyramid dimensions. Be rigorous. Be honest. Base all scores on evidence from the transcript.`;
  return prompt;
}

function extractJSON(text: string): any {
  try { return JSON.parse(text.trim()); } catch { }
  const start = text.indexOf('{');
  if (start === -1) throw new Error('No JSON found in response');
  let depth = 0; let inString = false; let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return JSON.parse(text.slice(start, i + 1)); }
  }
  throw new Error('No complete JSON object found in response');
}

async function callAssessor(config: AssessorConfig, transcriptText: string, setupContext: string, dossierContext?: string): Promise<any> {
  if (config.provider === 'anthropic') return callAnthropic(config, transcriptText, setupContext, dossierContext);
  if (config.provider === 'openai') return callOpenAI(config, transcriptText, setupContext, dossierContext);
  if (config.provider === 'google') return callGoogle(config, transcriptText, setupContext, dossierContext);
  throw new Error(`Unknown provider: ${config.provider}`);
}

async function callAssessorWithFallback(
  config: AssessorConfig,
  transcriptText: string,
  setupContext: string,
  dossierContext?: string
): Promise<{ verdict: any } | { error: string }> {
  const fallbacks: AssessorConfig[] = [
    config,
    { ...config, model: 'claude-sonnet-4-5-20250929', provider: 'anthropic' },
    { ...config, model: 'gpt-5.4', provider: 'openai' },
  ];
  let lastError = '';
  for (const fallbackConfig of fallbacks) {
    try {
      const response = await callAssessor(fallbackConfig, transcriptText, setupContext, dossierContext);
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
        body: JSON.stringify({ model: 'claude-sonnet-4-5-20250929', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
        signal: createTimeoutSignal(),
      });
      if (res.ok) return extractJSON(((await res.json()) as any).content[0]?.text || '');
    }
    if (process.env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-5.4', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
        signal: createTimeoutSignal(),
      });
      if (res.ok) return extractJSON(((await res.json()) as any).choices[0]?.message?.content || '');
    }
  } catch (err: any) { console.error('Chairman synthesis error:', err); }

  return {
    recommendation: verdicts.filter(v => v.recommendation === 'hire').length > verdicts.length / 2 ? 'hire' : 'no_hire',
    confidence: verdicts.reduce((sum, v) => sum + v.confidence, 0) / verdicts.length,
    narrative: `Based on ${verdicts.length} assessor verdicts.`,
    executiveSummary: `Synthesized from ${verdicts.length} specialized assessor perspectives.`,
  };
}

async function prepareTranscriptContext(transcript: any[], setup: any, sessionId?: string) {
  const transcriptText = transcript.length > 0
    ? transcript.map((e: any) => `[${e.timestamp}] ${e.speaker.toUpperCase()}: ${e.text}`).join('\n')
    : '[No transcript recorded - candidate may not have spoken during interview]';

  const setupContext = `Candidate: ${setup.candidateName}
Role: ${setup.roleName} (${setup.roleLevel || ''})
Job Description: ${setup.jobDescription || 'Not provided'}
CV Summary: ${setup.cvSummary || 'Not provided'}
Interview Mode: ${setup.interviewMode}
Active Gates: ${setup.activeGates?.join(', ') || 'standard gates'}`;

  // Load candidate intelligence dossier if a candidateId is linked
  let dossierContext: string | undefined;
  if (sessionId) {
    try {
      const session = await (prisma.interviewSession as any).findUnique({
        where: { id: sessionId },
        select: { candidateId: true },
      }) as { candidateId: string | null } | null;
      if (session?.candidateId) {
        const dossier = await compileDossier(prisma, session.candidateId);
        dossierContext = formatDossierForPrompt(dossier);
      }
    } catch (err: any) {
      console.warn('Failed to load candidate dossier for assessment:', err);
    }
  }

  return { transcriptText, setupContext, dossierContext };
}

// Legacy synchronous endpoint (kept for backward compat)
router.post('/assess', async (req: Request, res: Response) => {
  try {
    const { transcript, setup, observations, sessionId } = req.body;
    if (!transcript || !Array.isArray(transcript)) return res.status(400).json({ error: 'transcript array is required' });
    if (!setup) return res.status(400).json({ error: 'setup is required' });

    // Candidates may only assess their own session
    if (req.user?.role === 'candidate') {
      const ownSessionId = req.user.id.replace(/^candidate_/, '');
      if (!sessionId || sessionId !== ownSessionId) {
        return res.status(403).json({ error: 'Candidates may only access their own session' });
      }
    }

    const { transcriptText, setupContext, dossierContext } = await prepareTranscriptContext(transcript, setup, sessionId);

    if (!transcriptText || transcriptText.length < 200) {
      return res.status(400).json({ error: 'Insufficient interview data. The transcript must contain at least 200 characters for a reliable assessment.' });
    }

    const results = await Promise.allSettled(ASSESSOR_CONFIGS.map(config => callAssessorWithFallback(config, transcriptText, setupContext, dossierContext)));
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

  // Detect client disconnect to stop wasting API credits
  let clientDisconnected = false;
  req.on('close', () => { clientDisconnected = true; });

  try {
    const { transcript, setup, observations, sessionId, prosodyData } = req.body;

    // Candidates may only assess their own session
    if (req.user?.role === 'candidate') {
      const ownSessionId = req.user.id.replace(/^candidate_/, '');
      if (!sessionId || sessionId !== ownSessionId) {
        sendEvent('error', { message: 'Candidates may only access their own session' });
        res.end();
        return;
      }
    }

    if (!transcript || !Array.isArray(transcript) || !setup) {
      sendEvent('error', { message: 'transcript and setup are required' });
      res.end();
      return;
    }

    const { transcriptText, setupContext, dossierContext } = await prepareTranscriptContext(transcript, setup, sessionId);

    if (!transcriptText || transcriptText.length < 200) {
      sendEvent('error', { message: 'Insufficient interview data. The transcript must contain at least 200 characters for a reliable assessment.' });
      res.end();
      return;
    }

    sendEvent('start', { sessionId, assessorCount: ASSESSOR_CONFIGS.length });

    const verdicts: any[] = [];
    const errors: string[] = [];

    // Start all assessors in parallel — stream events as each completes
    const assessorPromises = ASSESSOR_CONFIGS.map(async (config, index) => {
      // Abort expensive LLM calls if the client has disconnected
      if (clientDisconnected) return;

      const startedAt = Date.now();
      sendEvent('assessor_start', { role: config.role, displayName: config.displayName, index });

      const result = await callAssessorWithFallback(config, transcriptText, setupContext, dossierContext);

      // Check again after the (potentially long) API call returns
      if (clientDisconnected) return;
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

    // Abort if client disconnected before chairman synthesis
    if (clientDisconnected) {
      console.warn('[assess/stream] Client disconnected before chairman synthesis — aborting');
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
