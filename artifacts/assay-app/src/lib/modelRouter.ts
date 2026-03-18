export interface ModelCapability {
  reasoning: 'low' | 'medium' | 'high';
  contextWindow: 'standard' | 'large' | 'massive';
  modality: ('text' | 'audio' | 'vision')[];
  costTier: 'economy' | 'standard' | 'premium';
}

export interface ModelEntry {
  id: string;
  provider: 'anthropic' | 'openai' | 'google';
  capabilities: ModelCapability;
  isAvailable: boolean;
  fallbacks: string[];
  costPer1kTokens: number;
  avgLatencyMs: number;
  deprecated?: boolean;
}

export const MODEL_REGISTRY: Record<string, ModelEntry> = {
  'claude-opus-4-6': {
    id: 'claude-opus-4-6',
    provider: 'anthropic',
    capabilities: { reasoning: 'high', contextWindow: 'large', modality: ['text'], costTier: 'premium' },
    isAvailable: true,
    fallbacks: ['claude-sonnet-4-6', 'gpt-4-turbo', 'gemini-2.5-flash'],
    costPer1kTokens: 0.015,
    avgLatencyMs: 3000,
  },
  'claude-sonnet-4-6': {
    id: 'claude-sonnet-4-6',
    provider: 'anthropic',
    capabilities: { reasoning: 'medium', contextWindow: 'large', modality: ['text'], costTier: 'standard' },
    isAvailable: true,
    fallbacks: ['claude-opus-4-6', 'gpt-4-turbo', 'gemini-2.5-flash'],
    costPer1kTokens: 0.003,
    avgLatencyMs: 1500,
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    provider: 'openai',
    capabilities: { reasoning: 'high', contextWindow: 'large', modality: ['text', 'vision'], costTier: 'standard' },
    isAvailable: true,
    fallbacks: ['claude-opus-4-6', 'claude-sonnet-4-6'],
    costPer1kTokens: 0.003,
    avgLatencyMs: 2000,
  },
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    provider: 'google',
    capabilities: { reasoning: 'medium', contextWindow: 'large', modality: ['text'], costTier: 'economy' },
    isAvailable: true,
    fallbacks: ['gemini-2.5-pro', 'claude-sonnet-4-6'],
    costPer1kTokens: 0.001,
    avgLatencyMs: 800,
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    provider: 'google',
    capabilities: { reasoning: 'high', contextWindow: 'massive', modality: ['text', 'vision'], costTier: 'standard' },
    isAvailable: true,
    fallbacks: ['gemini-2.5-flash', 'claude-opus-4-6'],
    costPer1kTokens: 0.007,
    avgLatencyMs: 2000,
  },
};

interface CallMetrics {
  totalCalls: number;
  failures: number;
  totalLatency: number;
}

export class ModelRouter {
  private registry: Record<string, ModelEntry>;
  private metrics: Map<string, CallMetrics>;
  private unavailableModels: Set<string>;

  constructor(registry?: Record<string, ModelEntry>) {
    this.registry = registry || MODEL_REGISTRY;
    this.metrics = new Map();
    this.unavailableModels = new Set();
    for (const modelId of Object.keys(this.registry)) {
      this.metrics.set(modelId, { totalCalls: 0, failures: 0, totalLatency: 0 });
    }
  }

  selectModel(requirements: Partial<ModelCapability>, preferredModel?: string): ModelEntry {
    if (preferredModel) {
      const preferred = this.registry[preferredModel];
      if (preferred && preferred.isAvailable && !this.unavailableModels.has(preferredModel)) {
        return preferred;
      }
    }

    const candidates = Object.values(this.registry).filter(m => {
      if (!m.isAvailable || this.unavailableModels.has(m.id)) return false;
      if (requirements.reasoning && this._reasoningLevel(m.capabilities.reasoning) < this._reasoningLevel(requirements.reasoning)) return false;
      if (requirements.modality?.length && !requirements.modality.every(mod => m.capabilities.modality.includes(mod))) return false;
      return true;
    });

    if (candidates.length === 0) {
      const available = Object.values(this.registry).filter(m => m.isAvailable && !this.unavailableModels.has(m.id));
      if (available.length === 0) throw new Error('No available models');
      return available.sort((a, b) => a.costPer1kTokens - b.costPer1kTokens)[0];
    }

    return candidates.sort((a, b) => {
      const aFail = this._getFailureRate(a.id);
      const bFail = this._getFailureRate(b.id);
      if (aFail !== bFail) return aFail - bFail;
      return a.costPer1kTokens - b.costPer1kTokens;
    })[0];
  }

  getFallback(failedModelId: string): ModelEntry | null {
    const model = this.registry[failedModelId];
    if (!model?.fallbacks) return null;
    for (const fbId of model.fallbacks) {
      const fb = this.registry[fbId];
      if (fb && fb.isAvailable && !this.unavailableModels.has(fbId)) return fb;
    }
    return null;
  }

  recordCall(modelId: string, success: boolean, latencyMs: number): void {
    let m = this.metrics.get(modelId) || { totalCalls: 0, failures: 0, totalLatency: 0 };
    m.totalCalls++;
    m.totalLatency += latencyMs;
    if (!success) m.failures++;
    this.metrics.set(modelId, m);
  }

  private _reasoningLevel(level: 'low' | 'medium' | 'high'): number {
    return { low: 1, medium: 2, high: 3 }[level];
  }

  private _getFailureRate(modelId: string): number {
    const m = this.metrics.get(modelId);
    return m && m.totalCalls > 0 ? m.failures / m.totalCalls : 0;
  }
}

export const modelRouter = new ModelRouter();
