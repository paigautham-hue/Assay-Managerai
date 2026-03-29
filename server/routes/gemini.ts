import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

/**
 * POST /gemini-token
 * Mints a short-lived ephemeral token for the Gemini Live API.
 * The permanent GOOGLE_API_KEY never leaves the server.
 *
 * The browser uses this token in the WebSocket URL instead of the raw API key.
 * Tokens are single-use (can only start one session) and expire in 2 minutes.
 * Session resumption reuses the same token, so reconnects work even after expiry.
 *
 * @see https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens
 */
router.post('/gemini-token', async (_req: Request, res: Response) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_API_KEY is not configured' });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-native-audio-dialog:generateEphemeralToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          ephemeralToken: {
            expireTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 min
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[gemini-token] Token mint failed:', response.status, errorText);
      return res.status(502).json({ error: 'Failed to mint Gemini token' });
    }

    const data = await response.json() as Record<string, any>;
    const token = data.ephemeralToken?.token || data.token;
    if (!token) {
      return res.status(502).json({ error: 'Invalid token response from Google' });
    }
    return res.json({ token });
  } catch (error) {
    console.error('[gemini-token] Error:', error);
    return res.status(500).json({ error: 'Internal error minting token' });
  }
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
