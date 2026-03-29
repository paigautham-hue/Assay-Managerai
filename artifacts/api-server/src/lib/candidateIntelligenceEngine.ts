import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// ── Types ────────────────────────────────────────────────────────────────────

export interface ResumeAnalysis {
  summary: string;
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    highlights: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year?: string;
  }>;
  certifications: string[];
  strengths: string[];
  redFlags: string[];
  totalYearsExperience: number;
}

export interface LinkedInAnalysis {
  careerTrajectory: string;
  tenurePatterns: string;
  progressionRate: string;
  endorsementStrength: string;
  networkSignals: string;
  strengths: string[];
  redFlags: string[];
  summary: string;
}

export interface FitAnalysis {
  overallFit: number; // 0-100
  dimensionFit: Record<string, { score: number; rationale: string }>;
  gaps: string[];
  strengths: string[];
  recommendations: string[];
  summary: string;
}

export interface InterviewBriefing {
  candidateSummary: string;
  suggestedQuestions: Array<{ question: string; rationale: string; priority: 'high' | 'medium' | 'low' }>;
  redFlagsToProbe: Array<{ flag: string; suggestedApproach: string }>;
  strengthsToValidate: Array<{ strength: string; howToValidate: string }>;
  fitSummary: string;
  interviewStrategy: string;
}

export interface ReferenceAnalysis {
  overallSentiment: 'strong_positive' | 'positive' | 'mixed' | 'negative';
  strengthThemes: string[];
  concernThemes: string[];
  consistencyNotes: string[];
  keyQuotes: string[];
  summary: string;
}

export interface CandidateDossier {
  candidate: {
    name: string;
    email?: string;
    currentRole?: string;
    currentCompany?: string;
    yearsExperience?: number;
    source?: string;
  };
  resumeAnalysis?: ResumeAnalysis;
  linkedinAnalysis?: LinkedInAnalysis;
  fitAnalysis?: FitAnalysis;
  briefing?: InterviewBriefing;
  references: Array<{
    refereeName: string;
    relation: string;
    status: string;
    analysis?: ReferenceAnalysis;
  }>;
  notes: Array<{
    content: string;
    type: string;
    userName: string;
    createdAt: string;
  }>;
}

// ── AI Analysis Functions ────────────────────────────────────────────────────

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

function parseJsonResponse<T>(text: string): T {
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const system = `You are an expert recruiter and resume analyst. Analyze the provided resume and extract structured information. Return ONLY valid JSON, no markdown.`;

  const prompt = `Analyze this resume and return a JSON object with exactly these fields:
{
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": [{"role": "title", "company": "name", "duration": "X years", "highlights": ["highlight1"]}],
  "education": [{"degree": "type", "institution": "name", "year": "2020"}],
  "certifications": ["cert1"],
  "strengths": ["strength1", "strength2"],
  "redFlags": ["any concerns like gaps, short tenures, inconsistencies"],
  "totalYearsExperience": 5
}

Resume text:
${resumeText}`;

  const result = await callClaude(system, prompt);
  return parseJsonResponse<ResumeAnalysis>(result);
}

export async function analyzeLinkedIn(profileText: string): Promise<LinkedInAnalysis> {
  const system = `You are an expert talent intelligence analyst. Analyze LinkedIn profile data to assess career trajectory, professional growth patterns, and potential concerns. Return ONLY valid JSON.`;

  const prompt = `Analyze this LinkedIn profile information and return a JSON object with exactly these fields:
{
  "careerTrajectory": "description of career path and direction",
  "tenurePatterns": "analysis of job tenures - stable, job-hopper, etc.",
  "progressionRate": "how fast they've progressed in seniority",
  "endorsementStrength": "assessment of endorsements and recommendations if available",
  "networkSignals": "what their network/connections suggest",
  "strengths": ["strength1", "strength2"],
  "redFlags": ["concern1"],
  "summary": "2-3 sentence overall assessment"
}

LinkedIn profile content:
${profileText}`;

  const result = await callClaude(system, prompt);
  return parseJsonResponse<LinkedInAnalysis>(result);
}

export async function analyzeFit(
  candidateInfo: { resumeAnalysis?: ResumeAnalysis; linkedinAnalysis?: LinkedInAnalysis; currentRole?: string; yearsExperience?: number },
  roleInfo: { roleName: string; roleLevel: string; jobDescription?: string; activeGates?: string[] }
): Promise<FitAnalysis> {
  const system = `You are a talent assessment expert specializing in candidate-role fit analysis. Provide objective, evidence-based fit scoring. Return ONLY valid JSON.`;

  const prompt = `Analyze how well this candidate fits the target role. Score 0-100 overall and per dimension.

CANDIDATE:
${candidateInfo.resumeAnalysis ? `Resume Summary: ${candidateInfo.resumeAnalysis.summary}\nSkills: ${candidateInfo.resumeAnalysis.skills.join(', ')}\nExperience: ${candidateInfo.resumeAnalysis.totalYearsExperience} years\nStrengths: ${candidateInfo.resumeAnalysis.strengths.join(', ')}` : ''}
${candidateInfo.linkedinAnalysis ? `\nLinkedIn: ${candidateInfo.linkedinAnalysis.summary}\nTrajectory: ${candidateInfo.linkedinAnalysis.careerTrajectory}` : ''}
${candidateInfo.currentRole ? `Current Role: ${candidateInfo.currentRole}` : ''}
${candidateInfo.yearsExperience ? `Years Experience: ${candidateInfo.yearsExperience}` : ''}

TARGET ROLE:
Role: ${roleInfo.roleName} (${roleInfo.roleLevel})
${roleInfo.jobDescription ? `Description: ${roleInfo.jobDescription}` : ''}
${roleInfo.activeGates?.length ? `Assessment Areas: ${roleInfo.activeGates.join(', ')}` : ''}

Return JSON:
{
  "overallFit": 75,
  "dimensionFit": {
    "domain_expertise": {"score": 80, "rationale": "..."},
    "experience_level": {"score": 70, "rationale": "..."},
    "skill_match": {"score": 85, "rationale": "..."}
  },
  "gaps": ["gap1"],
  "strengths": ["strength1"],
  "recommendations": ["recommendation1"],
  "summary": "2-3 sentence fit summary"
}`;

  const result = await callClaude(system, prompt);
  return parseJsonResponse<FitAnalysis>(result);
}

export async function generateBriefing(dossier: CandidateDossier, roleInfo: { roleName: string; roleLevel: string; jobDescription?: string; activeGates?: string[] }): Promise<InterviewBriefing> {
  const system = `You are a senior interview strategist. Given all available intelligence about a candidate and the target role, create a tactical pre-interview briefing that will help the interviewer ask the right questions and probe the right areas. Return ONLY valid JSON.`;

  const candidateContext = [
    `Candidate: ${dossier.candidate.name}`,
    dossier.candidate.currentRole ? `Current: ${dossier.candidate.currentRole} at ${dossier.candidate.currentCompany}` : '',
    dossier.resumeAnalysis ? `Resume: ${dossier.resumeAnalysis.summary}` : '',
    dossier.resumeAnalysis?.redFlags?.length ? `Resume Red Flags: ${dossier.resumeAnalysis.redFlags.join('; ')}` : '',
    dossier.resumeAnalysis?.strengths?.length ? `Resume Strengths: ${dossier.resumeAnalysis.strengths.join('; ')}` : '',
    dossier.linkedinAnalysis ? `LinkedIn: ${dossier.linkedinAnalysis.summary}` : '',
    dossier.linkedinAnalysis?.redFlags?.length ? `LinkedIn Red Flags: ${dossier.linkedinAnalysis.redFlags.join('; ')}` : '',
    dossier.fitAnalysis ? `Fit Score: ${dossier.fitAnalysis.overallFit}/100 — ${dossier.fitAnalysis.summary}` : '',
    dossier.fitAnalysis?.gaps?.length ? `Fit Gaps: ${dossier.fitAnalysis.gaps.join('; ')}` : '',
    dossier.references.filter(r => r.analysis).length ? `References: ${dossier.references.filter(r => r.analysis).map(r => `${r.refereeName} (${r.relation}): ${r.analysis!.summary}`).join('; ')}` : '',
    dossier.notes.length ? `Interviewer Notes: ${dossier.notes.map(n => n.content).join('; ')}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `Create a pre-interview briefing for this interview.

${candidateContext}

TARGET ROLE: ${roleInfo.roleName} (${roleInfo.roleLevel})
${roleInfo.jobDescription ? `Description: ${roleInfo.jobDescription}` : ''}
${roleInfo.activeGates?.length ? `Assessment Dimensions: ${roleInfo.activeGates.join(', ')}` : ''}

Return JSON:
{
  "candidateSummary": "3-4 sentence summary of everything we know",
  "suggestedQuestions": [
    {"question": "...", "rationale": "why this question matters given the intelligence", "priority": "high"}
  ],
  "redFlagsToProbe": [
    {"flag": "description of concern", "suggestedApproach": "how to explore this naturally"}
  ],
  "strengthsToValidate": [
    {"strength": "claimed strength", "howToValidate": "how to verify this is genuine"}
  ],
  "fitSummary": "How well candidate fits the role based on available data",
  "interviewStrategy": "Recommended approach for this specific interview"
}

Provide 5-8 suggested questions, 2-4 red flags, and 3-5 strengths to validate.`;

  const result = await callClaude(system, prompt);
  return parseJsonResponse<InterviewBriefing>(result);
}

export async function analyzeReference(
  refereeName: string,
  refereeRelation: string,
  responses: Record<string, any>,
  candidateName: string
): Promise<ReferenceAnalysis> {
  const system = `You are an expert at analyzing reference check responses. Identify patterns, red flags, and genuine strengths. Read between the lines — damning with faint praise, hesitations, and what's NOT said are as important as what IS said. Return ONLY valid JSON.`;

  const prompt = `Analyze these reference check responses for candidate ${candidateName}.

Referee: ${refereeName} (${refereeRelation})
Responses:
${JSON.stringify(responses, null, 2)}

Return JSON:
{
  "overallSentiment": "strong_positive" | "positive" | "mixed" | "negative",
  "strengthThemes": ["theme1"],
  "concernThemes": ["concern1"],
  "consistencyNotes": ["notes about consistency with other data"],
  "keyQuotes": ["notable direct quotes from responses"],
  "summary": "2-3 sentence analysis"
}`;

  const result = await callClaude(system, prompt);
  return parseJsonResponse<ReferenceAnalysis>(result);
}

// ── Dossier Compilation ──────────────────────────────────────────────────────

export async function compileDossier(prisma: any, candidateId: string): Promise<CandidateDossier> {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: {
      intelligence: { orderBy: { createdAt: 'desc' } },
      notes: { orderBy: { createdAt: 'desc' } },
      references: true,
    },
  });

  if (!candidate) throw new Error('Candidate not found');

  const resumeIntel = candidate.intelligence.find((i: any) => i.type === 'resume_analysis');
  const linkedinIntel = candidate.intelligence.find((i: any) => i.type === 'linkedin_analysis');
  const fitIntel = candidate.intelligence.find((i: any) => i.type === 'fit_analysis');
  const briefingIntel = candidate.intelligence.find((i: any) => i.type === 'briefing');

  return {
    candidate: {
      name: candidate.name,
      email: candidate.email || undefined,
      currentRole: candidate.currentRole || undefined,
      currentCompany: candidate.currentCompany || undefined,
      yearsExperience: candidate.yearsExperience || undefined,
      source: candidate.source || undefined,
    },
    resumeAnalysis: resumeIntel?.data as ResumeAnalysis | undefined,
    linkedinAnalysis: linkedinIntel?.data as LinkedInAnalysis | undefined,
    fitAnalysis: fitIntel?.data as FitAnalysis | undefined,
    briefing: briefingIntel?.data as InterviewBriefing | undefined,
    references: candidate.references.map((r: any) => ({
      refereeName: r.refereeName,
      relation: r.refereeRelation,
      status: r.status,
      analysis: r.aiAnalysis as ReferenceAnalysis | undefined,
    })),
    notes: candidate.notes.map((n: any) => ({
      content: n.content,
      type: n.type,
      userName: n.userName,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}

// ── Format dossier for AI consumption ────────────────────────────────────────

export function formatDossierForPrompt(dossier: CandidateDossier): string {
  const sections: string[] = [];

  sections.push(`=== CANDIDATE INTELLIGENCE DOSSIER ===`);
  sections.push(`Candidate: ${dossier.candidate.name}`);
  if (dossier.candidate.currentRole) sections.push(`Current: ${dossier.candidate.currentRole} at ${dossier.candidate.currentCompany || 'unknown'}`);
  if (dossier.candidate.yearsExperience) sections.push(`Experience: ${dossier.candidate.yearsExperience} years`);

  if (dossier.resumeAnalysis) {
    sections.push(`\n--- RESUME ANALYSIS ---`);
    sections.push(dossier.resumeAnalysis.summary);
    sections.push(`Key Skills: ${dossier.resumeAnalysis.skills.slice(0, 10).join(', ')}`);
    if (dossier.resumeAnalysis.strengths.length) sections.push(`Strengths: ${dossier.resumeAnalysis.strengths.join('; ')}`);
    if (dossier.resumeAnalysis.redFlags.length) sections.push(`Red Flags: ${dossier.resumeAnalysis.redFlags.join('; ')}`);
    sections.push(`Experience: ${dossier.resumeAnalysis.experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join('; ')}`);
  }

  if (dossier.linkedinAnalysis) {
    sections.push(`\n--- LINKEDIN ANALYSIS ---`);
    sections.push(dossier.linkedinAnalysis.summary);
    sections.push(`Career Trajectory: ${dossier.linkedinAnalysis.careerTrajectory}`);
    sections.push(`Tenure Patterns: ${dossier.linkedinAnalysis.tenurePatterns}`);
    if (dossier.linkedinAnalysis.redFlags.length) sections.push(`Concerns: ${dossier.linkedinAnalysis.redFlags.join('; ')}`);
  }

  if (dossier.fitAnalysis) {
    sections.push(`\n--- FIT ANALYSIS ---`);
    sections.push(`Overall Fit: ${dossier.fitAnalysis.overallFit}/100`);
    sections.push(dossier.fitAnalysis.summary);
    if (dossier.fitAnalysis.gaps.length) sections.push(`Gaps: ${dossier.fitAnalysis.gaps.join('; ')}`);
  }

  const completedRefs = dossier.references.filter(r => r.analysis);
  if (completedRefs.length) {
    sections.push(`\n--- REFERENCE CHECKS ---`);
    for (const ref of completedRefs) {
      sections.push(`${ref.refereeName} (${ref.relation}): ${ref.analysis!.summary}`);
      if (ref.analysis!.concernThemes.length) sections.push(`  Concerns: ${ref.analysis!.concernThemes.join('; ')}`);
    }
  }

  if (dossier.notes.length) {
    sections.push(`\n--- INTERVIEWER NOTES ---`);
    for (const note of dossier.notes.slice(0, 5)) {
      sections.push(`[${note.type}] ${note.userName}: ${note.content}`);
    }
  }

  sections.push(`\n=== END DOSSIER ===`);
  return sections.join('\n');
}
