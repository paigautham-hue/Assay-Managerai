import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

/**
 * GET /gemini-key
 * Returns the Gemini API key for the frontend Gemini Live engine.
 * The key is kept server-side so it never appears in client bundles.
 */
router.get('/gemini-key', (_req: Request, res: Response) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_API_KEY is not configured' });
  }
  return res.json({ apiKey });
});

/**
 * GET /voice-provider
 * Returns which voice provider to use (gemini or openai).
 * Allows switching between providers without code changes.
 */
router.get('/voice-provider', (_req: Request, res: Response) => {
  const provider = process.env.VOICE_PROVIDER || 'gemini';
  return res.json({ provider });
});

export default router;
