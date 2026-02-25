import { NextResponse } from 'next/server';

/**
 * Returns available pre-configured providers based on server env vars.
 * Keys are masked — actual keys are only used server-side in /api/generate.
 */
export async function GET() {
  const providers = [];

  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    providers.push({
      id: 'openai',
      name: 'OpenAI',
      icon: '🤖',
      description: 'GPT-4o, GPT-4o-mini — fast and reliable',
      hasKey: true,
      maskedKey: maskKey(process.env.OPENAI_API_KEY),
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      ready: true,
      models: [
        { id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast, cheap)' },
        { id: 'gpt-4o', label: 'GPT-4o (best quality)' },
      ],
    });
  } else {
    providers.push({
      id: 'openai',
      name: 'OpenAI',
      icon: '🤖',
      description: 'Paste your API key to connect',
      hasKey: false,
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      ready: false,
      needsUserKey: true,
      models: [
        { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
        { id: 'gpt-4o', label: 'GPT-4o' },
      ],
    });
  }

  // Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push({
      id: 'anthropic',
      name: 'Anthropic',
      icon: '🧠',
      description: 'Claude Sonnet, Claude Haiku',
      hasKey: true,
      maskedKey: maskKey(process.env.ANTHROPIC_API_KEY),
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-sonnet-4-20250514',
      ready: true,
      models: [
        { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (recommended)' },
        { id: 'claude-haiku-4-20250414', label: 'Claude Haiku 4 (fast)' },
      ],
    });
  } else {
    providers.push({
      id: 'anthropic',
      name: 'Anthropic',
      icon: '🧠',
      description: 'Paste your API key — get one at console.anthropic.com',
      hasKey: false,
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-sonnet-4-20250514',
      ready: false,
      needsUserKey: true,
      models: [
        { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
        { id: 'claude-haiku-4-20250414', label: 'Claude Haiku 4' },
      ],
    });
  }

  // Jarvis (OpenClaw Agent) — uses OpenAI key under the hood
  if (process.env.OPENAI_API_KEY) {
    providers.push({
      id: 'openclaw',
      name: 'Jarvis',
      icon: '🔧',
      description: 'AI agent with security focus — powered by GPT-4o',
      hasKey: true,
      baseUrl: 'local',
      model: 'agent',
      ready: true,
      models: [{ id: 'agent', label: 'Jarvis Agent' }],
    });
  }

  // Ollama (local)
  let ollamaReady = false;
  try {
    const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      ollamaReady = true;
      const data = await res.json();
      const models = (data.models || []).map((m: { name: string }) => ({ id: m.name, label: m.name }));
      providers.push({
        id: 'ollama',
        name: 'Ollama',
        icon: '🦙',
        description: `${models.length} local model${models.length !== 1 ? 's' : ''} — free and private`,
        hasKey: false,
        baseUrl: 'http://localhost:11434/v1',
        model: models[0]?.id || 'llama3.1',
        ready: true,
        models: models.length ? models : [{ id: 'llama3.1', label: 'Llama 3.1' }],
      });
    }
  } catch { /* not running */ }

  if (!ollamaReady) {
    providers.push({
      id: 'ollama',
      name: 'Ollama',
      icon: '🦙',
      description: 'Not running — install from ollama.ai',
      hasKey: false,
      baseUrl: 'http://localhost:11434/v1',
      model: 'llama3.1',
      ready: false,
      models: [{ id: 'llama3.1', label: 'Llama 3.1' }],
    });
  }

  // Custom
  providers.push({
    id: 'custom',
    name: 'Custom API',
    icon: '🔌',
    description: 'Any OpenAI-compatible endpoint',
    hasKey: false,
    baseUrl: '',
    model: '',
    ready: false,
    needsUserKey: true,
    needsUserUrl: true,
    models: [],
  });

  return NextResponse.json({ providers });
}

function maskKey(key: string): string {
  if (key.length < 12) return '****';
  return key.slice(0, 7) + '...' + key.slice(-4);
}
