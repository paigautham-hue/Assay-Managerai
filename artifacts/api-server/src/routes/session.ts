import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.post('/session', async (req: Request, res: Response) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
    }

    const { systemPrompt, voice, tools } = req.body;

    if (!systemPrompt) {
      return res.status(400).json({ error: 'systemPrompt is required' });
    }

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        modalities: ['text', 'audio'],
        instructions: systemPrompt,
        voice: voice || 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 8000,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI Realtime session error:', error);
      return res.status(response.status).json({ error: 'Failed to create OpenAI session' });
    }

    const data = await response.json();

    return res.json({
      clientSecret: data.client_secret?.value || data.client_secret,
      sessionId: data.id,
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
