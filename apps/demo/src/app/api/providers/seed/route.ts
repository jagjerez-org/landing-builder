import { NextResponse } from 'next/server';

/**
 * Returns available pre-configured providers based on server env vars.
 * API keys are masked for the client — the actual keys are only used server-side in /api/generate.
 */
export async function GET() {
  const providers = [];

  if (process.env.OPENAI_API_KEY) {
    providers.push({
      id: 'openai',
      name: 'OpenAI',
      icon: '🤖',
      description: 'GPT-4o, GPT-4o-mini',
      hasKey: true,
      maskedKey: maskKey(process.env.OPENAI_API_KEY),
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      models: [
        { id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast, cheap)' },
        { id: 'gpt-4o', label: 'GPT-4o (best quality)' },
      ],
    });
  }

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
      models: [
        { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (recommended)' },
        { id: 'claude-haiku-4-20250414', label: 'Claude Haiku 4 (fast)' },
      ],
    });
  }

  // OpenClaw agent (Jarvis)
  const openclawUrl = process.env.OPENCLAW_URL || 'http://localhost:18789';
  let openclawReady = false;
  try {
    const res = await fetch(`${openclawUrl}/health`, { signal: AbortSignal.timeout(2000) });
    openclawReady = res.ok;
  } catch { /* not available */ }

  providers.push({
    id: 'openclaw',
    name: 'Jarvis (OpenClaw)',
    icon: '🔧',
    description: openclawReady ? 'Connected — self-hosted AI agent' : 'Not running — start OpenClaw first',
    hasKey: false,
    baseUrl: openclawUrl,
    model: 'agent',
    ready: openclawReady,
    models: [{ id: 'agent', label: 'Agent Default' }],
  });

  // Ollama (check if running)
  let ollamaReady = false;
  try {
    const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      ollamaReady = true;
      const data = await res.json();
      const models = (data.models || []).map((m: { name: string }) => ({
        id: m.name,
        label: m.name,
      }));
      providers.push({
        id: 'ollama',
        name: 'Ollama (Local)',
        icon: '🦙',
        description: `${models.length} models available — free, private`,
        hasKey: false,
        baseUrl: 'http://localhost:11434/v1',
        model: models[0]?.id || 'llama3.1',
        ready: true,
        models: models.length ? models : [{ id: 'llama3.1', label: 'Llama 3.1' }],
      });
    }
  } catch { /* not available */ }

  if (!ollamaReady) {
    providers.push({
      id: 'ollama',
      name: 'Ollama (Local)',
      icon: '🦙',
      description: 'Not running — install from ollama.ai',
      hasKey: false,
      baseUrl: 'http://localhost:11434/v1',
      model: 'llama3.1',
      ready: false,
      models: [{ id: 'llama3.1', label: 'Llama 3.1' }],
    });
  }

  return NextResponse.json({ providers });
}

function maskKey(key: string): string {
  if (key.length < 12) return '****';
  return key.slice(0, 7) + '...' + key.slice(-4);
}
