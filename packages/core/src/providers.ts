/**
 * AI Provider system — pluggable backends for content generation.
 * 
 * Providers:
 * - OpenAI-compatible (OpenAI, Together, Groq, Ollama, LM Studio, etc.)
 * - Anthropic-compatible (Claude API)
 * - OpenClaw Agent (self-hosted Jarvis or any OpenClaw agent)
 * - Custom (bring your own endpoint)
 */

import type { LlmAdapter, LlmMessage } from './llm-adapter';

// ─── Provider Types ─────────────────────────────────────

export type ProviderType = 'openai' | 'anthropic' | 'openclaw' | 'ollama' | 'custom';

export interface ProviderConfig {
  type: ProviderType;
  name: string;
  description: string;
  icon: string;

  /** Auth method */
  auth: ProviderAuth;

  /** Base URL for API calls */
  baseUrl: string;

  /** Model to use */
  model: string;

  /** Is this provider currently connected/authenticated */
  connected: boolean;
}

export type ProviderAuth =
  | { method: 'api-key'; key: string }
  | { method: 'oauth'; accessToken: string; refreshToken?: string; expiresAt?: number }
  | { method: 'none' }; // For local/self-hosted

// ─── Provider Registry ──────────────────────────────────

export class ProviderRegistry {
  private providers = new Map<string, ProviderConfig>();
  private activeId: string | null = null;

  register(id: string, config: ProviderConfig): void {
    this.providers.set(id, config);
  }

  remove(id: string): void {
    this.providers.delete(id);
    if (this.activeId === id) this.activeId = null;
  }

  get(id: string): ProviderConfig | undefined {
    return this.providers.get(id);
  }

  getAll(): { id: string; config: ProviderConfig }[] {
    return Array.from(this.providers.entries()).map(([id, config]) => ({ id, config }));
  }

  setActive(id: string): void {
    if (!this.providers.has(id)) throw new Error(`Provider "${id}" not registered`);
    this.activeId = id;
  }

  getActive(): { id: string; config: ProviderConfig } | null {
    if (!this.activeId) return null;
    const config = this.providers.get(this.activeId);
    if (!config) return null;
    return { id: this.activeId, config };
  }

  /** Create an LlmAdapter from the active provider */
  createAdapter(): LlmAdapter {
    const active = this.getActive();
    if (!active) throw new Error('No active AI provider. Connect one first.');
    return createAdapterFromConfig(active.id, active.config);
  }
}

// ─── Adapter Factories ──────────────────────────────────

function createAdapterFromConfig(id: string, config: ProviderConfig): LlmAdapter {
  switch (config.type) {
    case 'openai':
    case 'ollama':
    case 'custom':
      return createOpenAICompatibleAdapter(id, config);
    case 'anthropic':
      return createAnthropicAdapter(id, config);
    case 'openclaw':
      return createOpenClawAdapter(id, config);
    default:
      throw new Error(`Unknown provider type: ${config.type}`);
  }
}

function getAuthHeader(auth: ProviderAuth): Record<string, string> {
  switch (auth.method) {
    case 'api-key':
      return { Authorization: `Bearer ${auth.key}` };
    case 'oauth':
      return { Authorization: `Bearer ${auth.accessToken}` };
    case 'none':
      return {};
  }
}

function createOpenAICompatibleAdapter(id: string, config: ProviderConfig): LlmAdapter {
  return {
    name: id,
    async complete(messages: LlmMessage[]): Promise<string> {
      const res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(config.auth) },
        body: JSON.stringify({ model: config.model, messages, temperature: 0.7 }),
      });
      if (!res.ok) throw new Error(`${id} request failed (${res.status}): ${await res.text()}`);
      const data = await res.json() as { choices: { message: { content: string } }[] };
      return data.choices[0].message.content;
    },
  };
}

function createAnthropicAdapter(id: string, config: ProviderConfig): LlmAdapter {
  return {
    name: id,
    async complete(messages: LlmMessage[]): Promise<string> {
      const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
      const userMessages = messages.filter((m) => m.role !== 'system').map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      };

      // Support both API key and OAuth
      if (config.auth.method === 'api-key') {
        headers['x-api-key'] = config.auth.key;
      } else if (config.auth.method === 'oauth') {
        headers['Authorization'] = `Bearer ${config.auth.accessToken}`;
      }

      const res = await fetch(`${config.baseUrl}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          max_tokens: 4096,
          system,
          messages: userMessages,
        }),
      });

      if (!res.ok) throw new Error(`${id} request failed (${res.status}): ${await res.text()}`);
      const data = await res.json() as { content: { type: string; text: string }[] };
      return data.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    },
  };
}

function createOpenClawAdapter(id: string, config: ProviderConfig): LlmAdapter {
  return {
    name: id,
    async complete(messages: LlmMessage[]): Promise<string> {
      // OpenClaw agent endpoint — sends a task and gets the response
      const prompt = messages.map((m) => m.content).join('\n\n');

      const res = await fetch(`${config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(config.auth),
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`OpenClaw agent request failed (${res.status}): ${await res.text()}`);
      const data = await res.json() as { response?: string; result?: string; content?: string };
      return data.response ?? data.result ?? data.content ?? JSON.stringify(data);
    },
  };
}

// ─── Preset Configs ─────────────────────────────────────

export const PROVIDER_PRESETS: Record<string, Omit<ProviderConfig, 'auth' | 'connected'>> = {
  openai: {
    type: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini',
    icon: '🤖',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  anthropic: {
    type: 'anthropic',
    name: 'Anthropic',
    description: 'Claude Sonnet, Claude Haiku',
    icon: '🧠',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-20250514',
  },
  openclaw: {
    type: 'openclaw',
    name: 'OpenClaw Agent',
    description: 'Self-hosted AI agent (Jarvis, etc.)',
    icon: '🔧',
    baseUrl: 'http://localhost:18789',
    model: 'agent',
  },
  ollama: {
    type: 'ollama',
    name: 'Ollama (Local)',
    description: 'Run models locally — Llama, Mistral, etc.',
    icon: '🦙',
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3.1',
  },
  groq: {
    type: 'openai',
    name: 'Groq',
    description: 'Ultra-fast inference — Llama, Mixtral',
    icon: '⚡',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.1-70b-versatile',
  },
  together: {
    type: 'openai',
    name: 'Together AI',
    description: 'Open source models at scale',
    icon: '🤝',
    baseUrl: 'https://api.together.xyz/v1',
    model: 'meta-llama/Llama-3-70b-chat-hf',
  },
  lmstudio: {
    type: 'openai',
    name: 'LM Studio',
    description: 'Local models via LM Studio',
    icon: '💻',
    baseUrl: 'http://localhost:1234/v1',
    model: 'local-model',
  },
};
