import { NextResponse } from 'next/server';

/**
 * Proxy to Jarvis (OpenClaw agent) via WebSocket sessions_spawn.
 * This creates a one-shot sub-agent that generates the landing page JSON.
 * 
 * Since OpenClaw doesn't expose a REST chat completions API,
 * we use the WebSocket gateway to spawn a sub-agent task.
 */

const GATEWAY_URL = process.env.OPENCLAW_WS_URL || 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_TOKEN || 'fba0186a4c32440e0531d4afae55fc569364dd0bc4058b70';

export async function POST(req: Request) {
  try {
    const { systemPrompt, userPrompt } = await req.json();

    const fullPrompt = `${systemPrompt}\n\nUser request:\n${userPrompt}\n\nRespond with ONLY the JSON. No markdown, no explanation.`;

    // Use HTTP API to create a task if available, otherwise fall back
    // For now, use a simpler approach: call the Anthropic API directly with the same key
    // that OpenClaw uses, since Jarvis IS Claude under the hood
    
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({ error: 'No Anthropic API key configured for Jarvis proxy' }, { status: 500 });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Jarvis backend error (${res.status}): ${text}`);
    }

    const data = await res.json();
    const content = data.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('') ?? '';

    return NextResponse.json({ content });
  } catch (err: unknown) {
    console.error('Jarvis proxy error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
