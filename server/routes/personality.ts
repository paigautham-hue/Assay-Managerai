import { Router, type Request, type Response } from 'express';
import prisma from '../db/prisma.js';

const router = Router();

interface AIPersonality {
  style: 'formal' | 'casual' | 'balanced';
  pace: 'thorough' | 'moderate' | 'efficient';
  focusAreas: string[];
  customInstructions: string;
  interviewerName: string;
}

const DEFAULT_PERSONALITY: AIPersonality = {
  style: 'balanced',
  pace: 'moderate',
  focusAreas: [],
  customInstructions: '',
  interviewerName: 'Sophia',
};

// GET /personality — Returns current org personality settings
router.get('/personality', async (req: Request, res: Response) => {
  try {
    const orgId = req.user?.organizationId;
    if (!orgId) {
      res.json(DEFAULT_PERSONALITY);
      return;
    }

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { settings: true },
    });

    if (!org) {
      res.json(DEFAULT_PERSONALITY);
      return;
    }

    const settings = (org.settings as Record<string, unknown>) || {};
    const personality = {
      ...DEFAULT_PERSONALITY,
      ...(settings.aiPersonality as Partial<AIPersonality> | undefined),
    };

    res.json(personality);
  } catch (err) {
    console.error('[personality] GET error:', err);
    res.status(500).json({ error: 'Failed to load personality settings' });
  }
});

// PATCH /personality — Updates personality settings (owner/admin only)
router.patch('/personality', async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.organizationId) {
      res.status(400).json({ error: 'No organization associated with user' });
      return;
    }

    if (!['owner', 'admin'].includes(user.role)) {
      res.status(403).json({ error: 'Only owners and admins can update personality settings' });
      return;
    }

    const { style, pace, focusAreas, customInstructions, interviewerName } = req.body;

    // Validate style
    if (style !== undefined && !['formal', 'casual', 'balanced'].includes(style)) {
      res.status(400).json({ error: 'Invalid style. Must be formal, casual, or balanced.' });
      return;
    }

    // Validate pace
    if (pace !== undefined && !['thorough', 'moderate', 'efficient'].includes(pace)) {
      res.status(400).json({ error: 'Invalid pace. Must be thorough, moderate, or efficient.' });
      return;
    }

    // Validate focusAreas
    const validFocusAreas = ['Leadership', 'Strategy', 'Culture', 'Technical', 'People', 'Financial'];
    if (focusAreas !== undefined) {
      if (!Array.isArray(focusAreas) || focusAreas.some((a: string) => !validFocusAreas.includes(a))) {
        res.status(400).json({ error: `Invalid focusAreas. Must be array of: ${validFocusAreas.join(', ')}` });
        return;
      }
    }

    // Fetch current settings
    const org = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { settings: true },
    });

    const currentSettings = (org?.settings as Record<string, unknown>) || {};
    const currentPersonality = (currentSettings.aiPersonality as Partial<AIPersonality>) || {};

    const updatedPersonality: AIPersonality = {
      ...DEFAULT_PERSONALITY,
      ...currentPersonality,
      ...(style !== undefined && { style }),
      ...(pace !== undefined && { pace }),
      ...(focusAreas !== undefined && { focusAreas }),
      ...(customInstructions !== undefined && { customInstructions }),
      ...(interviewerName !== undefined && { interviewerName }),
    };

    await prisma.organization.update({
      where: { id: user.organizationId },
      data: {
        settings: {
          ...currentSettings,
          aiPersonality: updatedPersonality as any,
        } as any,
      },
    });

    res.json(updatedPersonality);
  } catch (err) {
    console.error('[personality] PATCH error:', err);
    res.status(500).json({ error: 'Failed to update personality settings' });
  }
});

export default router;
