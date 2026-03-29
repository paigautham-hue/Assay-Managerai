import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireRole } from '../middleware/auth.js';

const router = Router();

interface SentimentSegment {
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  start?: number;
  end?: number;
}

async function analyzeWithAssemblyAI(text: string): Promise<SentimentSegment[]> {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) return [];

  // Use AssemblyAI LeMUR with input_text for sentiment analysis
  const prompt = `Analyze the sentiment of each sentence in the following interview transcript from a candidate. 
For each meaningful sentence or phrase, return a JSON array where each element has:
- "text": the sentence/phrase
- "sentiment": "POSITIVE", "NEGATIVE", or "NEUTRAL"  
- "confidence": a number between 0 and 1

Focus only on the substance of what is said, not filler words.
Return ONLY valid JSON array, no explanation.

Transcript:
${text}`;

  try {
    const res = await fetch('https://api.assemblyai.com/lemur/v3/generate/task', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        input_text: text,
        final_model: 'anthropic/claude-sonnet-4-5',
        max_output_size: 3000,
        temperature: 0.0,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`AssemblyAI LeMUR error ${res.status}: ${err.substring(0, 200)}`);
      return [];
    }

    const data: any = await res.json();
    const responseText: string = data.response ?? '';

    const match = responseText.match(/\[[\s\S]*\]/);
    if (!match) return [];

    const parsed = JSON.parse(match[0]);
    return (parsed as any[]).map(item => ({
      text: String(item.text ?? ''),
      sentiment: (['POSITIVE', 'NEGATIVE', 'NEUTRAL'].includes(item.sentiment)
        ? item.sentiment
        : 'NEUTRAL') as SentimentSegment['sentiment'],
      confidence: Math.min(1, Math.max(0, Number(item.confidence ?? 0.7))),
    }));
  } catch (err) {
    console.warn('AssemblyAI sentiment analysis failed:', err);
    return [];
  }
}

function keywordFallback(text: string): SentimentSegment[] {
  // Simple keyword-based fallback when no API key is configured
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  const positiveWords = ['success', 'achieved', 'led', 'improved', 'grew', 'built', 'created',
    'excited', 'proud', 'strong', 'excellent', 'great', 'effectively', 'efficiently'];
  const negativeWords = ['failed', 'struggled', 'difficult', 'challenging', 'problem', 'issue',
    'mistake', 'wrong', 'unfortunately', 'bad', 'poor', 'loss', 'crisis'];

  return sentences.map(sentence => {
    const lower = sentence.toLowerCase();
    const posCount = positiveWords.filter(w => lower.includes(w)).length;
    const negCount = negativeWords.filter(w => lower.includes(w)).length;

    let sentiment: SentimentSegment['sentiment'] = 'NEUTRAL';
    if (posCount > negCount) sentiment = 'POSITIVE';
    else if (negCount > posCount) sentiment = 'NEGATIVE';

    const delta = Math.abs(posCount - negCount);
    const confidence = Math.min(0.9, 0.5 + delta * 0.1);

    return { text: sentence.trim(), sentiment, confidence };
  }).filter(s => s.text.length > 0);
}

router.post('/sentiment', async (req: Request, res: Response) => {
  try {
    const { text, transcript } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text string is required' });
    }

    const hasAssemblyAI = Boolean(process.env.ASSEMBLYAI_API_KEY);
    let sentimentSegments: SentimentSegment[];

    if (hasAssemblyAI) {
      sentimentSegments = await analyzeWithAssemblyAI(text);
    } else {
      // Graceful fallback: keyword-based analysis
      sentimentSegments = keywordFallback(text);
    }

    return res.json({
      sentimentSegments,
      analysisMethod: hasAssemblyAI ? 'assemblyai' : 'keyword_fallback',
      segmentCount: sentimentSegments.length,
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return res.status(500).json({ error: 'Sentiment analysis failed', sentimentSegments: [] });
  }
});

// Proxy endpoint to serve Hume API key from backend (not exposed in client bundle)
router.get('/hume-token', requireRole('admin', 'interviewer'), (_req: Request, res: Response) => {
  const key = process.env.HUME_API_KEY;
  if (!key) return res.status(404).json({ error: 'HUME_API_KEY not configured' });
  return res.json({ apiKey: key });
});

export default router;
