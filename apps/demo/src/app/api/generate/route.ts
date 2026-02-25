import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a world-class landing page designer. Given a description, generate a complete landing page as JSON.

OUTPUT ONLY VALID JSON. No markdown, no explanation, no code fences.

The JSON must follow this exact schema:

{
  "id": "unique-kebab-case-id",
  "name": "Page Name",
  "slug": "page-slug",
  "meta": { "title": "SEO Title", "description": "SEO description" },
  "theme": {
    "preset": "string",
    "colors": { "primary": "#hex", "secondary": "#hex", "background": "#hex", "text": "#hex", "accent": "#hex" },
    "fonts": { "heading": "font name", "body": "font name" },
    "borderRadius": "none|sm|md|lg|full",
    "spacing": "compact|normal|relaxed"
  },
  "sections": [ ...array of sections ]
}

Each section:
{
  "id": "unique-kebab-case",
  "type": "section-type",
  "order": number,
  "visible": true,
  "props": { ...type-specific },
  "style": { "backgroundColor": "#hex (optional)" }
}

SECTION TYPES AND THEIR PROPS:

hero: { headline, subheadline, ctaText, ctaUrl, secondaryCtaText?, secondaryCtaUrl?, image?, layout: "centered"|"split"|"background" }
features: { headline, subheadline?, features: [{ icon: "emoji", title, description }], columns: 2|3|4 }
pricing: { headline, subheadline?, tiers: [{ name, price, period, features: string[], ctaText, ctaUrl, highlighted: boolean }] }
testimonials: { headline, testimonials: [{ quote, author, role, avatar?, rating: 1-5 }], layout: "grid"|"carousel"|"stack" }
cta: { headline, subheadline?, buttonText, buttonUrl, variant: "simple"|"with-input"|"split" }
faq: { headline, items: [{ question, answer }] }
footer: { logo?, tagline?, links: [{ label, url, group? }], socials: [{ platform, url }], copyright }
gallery: { headline, images: [{ src: "https://placehold.co/800x600/COLOR/white?text=LABEL", alt, caption? }], columns: 2|3|4, layout: "grid" }
stats: { headline?, stats: [{ value, label, icon: "emoji" }] }
team: { headline, subheadline?, members: [{ name, role, avatar?, bio? }] }
contact: { headline, subheadline?, email?, phone?, address?, formFields: [{ type: "text"|"email"|"tel"|"textarea"|"select", name, label, placeholder?, required?, options?: string[] }] }

RULES:
1. Generate REAL, compelling, professional marketing copy. NO lorem ipsum.
2. Cohesive color scheme matching the business type
3. Always start with hero, end with footer
4. Generate 5-8 sections
5. For images use placehold.co: https://placehold.co/800x600/HEX/white?text=Label (no # in hex)
6. Match tone to business type
7. Include realistic pricing, testimonials (3-5), FAQ (4-6 items)
8. Stats should be impressive but believable`;

interface GenerateRequest {
  prompt: string;
  locale?: string;
  provider: 'openai' | 'anthropic' | 'openclaw' | 'ollama' | 'custom';
  apiKey?: string;       // User-pasted API key
  oauthToken?: string;   // OAuth access token
  baseUrl?: string;
  model?: string;
  useServerKey?: boolean;
}

/**
 * Call OpenAI-compatible API (works for OpenAI, Ollama, custom endpoints)
 */
async function callOpenAICompatible(opts: {
  baseUrl: string;
  apiKey?: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}): Promise<string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.apiKey) headers['Authorization'] = `Bearer ${opts.apiKey}`;

  const res = await fetch(`${opts.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: 'system', content: opts.systemPrompt },
        { role: 'user', content: opts.userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Call Anthropic Messages API
 * Supports both x-api-key (API key) and Bearer auth (OAuth token)
 */
async function callAnthropic(opts: {
  apiKey?: string;
  oauthToken?: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
  };

  if (opts.oauthToken) {
    // OAuth token — Bearer auth with special beta headers (same as Claude Code / OpenClaw)
    headers['Authorization'] = `Bearer ${opts.oauthToken}`;
    headers['anthropic-beta'] = 'oauth-2025-04-20';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  } else if (opts.apiKey) {
    headers['x-api-key'] = opts.apiKey;
  } else {
    throw new Error('No Anthropic credentials');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 4096,
      system: opts.systemPrompt,
      messages: [{ role: 'user', content: opts.userPrompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('') ?? '';
}

export async function POST(req: Request) {
  try {
    const body: GenerateRequest = await req.json();
    const { prompt, locale, provider, baseUrl, model, useServerKey, oauthToken } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let userPrompt = prompt;
    if (locale && locale !== 'en') {
      userPrompt += `\n\nIMPORTANT: Generate ALL text content in ${locale}. Everything must be in ${locale}.`;
    }

    let result: string;

    switch (provider) {
      case 'openai': {
        // Priority: OAuth token > user API key > server key
        const token = oauthToken || body.apiKey || (useServerKey ? process.env.OPENAI_API_KEY : undefined) || process.env.OPENAI_API_KEY;
        if (!token) return NextResponse.json({ error: 'No OpenAI credentials. Sign in with OpenAI or paste an API key.' }, { status: 400 });
        result = await callOpenAICompatible({
          baseUrl: baseUrl || 'https://api.openai.com/v1',
          apiKey: token,
          model: model || 'gpt-4o-mini',
          systemPrompt: SYSTEM_PROMPT,
          userPrompt,
        });
        break;
      }

      case 'anthropic': {
        // Priority: user OAuth token > user API key > server key (which may be OAuth)
        const serverKey = process.env.ANTHROPIC_API_KEY;
        const key = body.apiKey || serverKey;
        const effectiveOAuth = oauthToken || (serverKey?.includes('sk-ant-oat') ? serverKey : undefined);
        const effectiveApiKey = !effectiveOAuth ? key : undefined;
        if (!effectiveOAuth && !effectiveApiKey) return NextResponse.json({ error: 'No Anthropic credentials. Sign in with Claude or paste an API key.' }, { status: 400 });
        result = await callAnthropic({
          apiKey: effectiveApiKey,
          oauthToken: effectiveOAuth,
          model: model || 'claude-sonnet-4-20250514',
          systemPrompt: SYSTEM_PROMPT,
          userPrompt,
        });
        break;
      }

      case 'openclaw': {
        // Jarvis: use OAuth token or fall back to OpenAI key
        const token = oauthToken || process.env.OPENAI_API_KEY;
        if (!token) return NextResponse.json({ error: 'No credentials configured for Jarvis.' }, { status: 400 });
        result = await callOpenAICompatible({
          baseUrl: 'https://api.openai.com/v1',
          apiKey: token,
          model: 'gpt-4o-mini',
          systemPrompt: SYSTEM_PROMPT + '\n\nYou are Jarvis, an AI agent. Generate with extra attention to security and technical accuracy.',
          userPrompt,
        });
        break;
      }

      case 'ollama': {
        result = await callOpenAICompatible({
          baseUrl: baseUrl || 'http://localhost:11434/v1',
          model: model || 'llama3.1',
          systemPrompt: SYSTEM_PROMPT,
          userPrompt,
        });
        break;
      }

      case 'custom': {
        if (!baseUrl) return NextResponse.json({ error: 'Base URL is required for custom provider' }, { status: 400 });
        result = await callOpenAICompatible({
          baseUrl,
          apiKey: body.apiKey,
          model: model || 'gpt-4o-mini',
          systemPrompt: SYSTEM_PROMPT,
          userPrompt,
        });
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    // Extract JSON
    const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = (jsonMatch?.[1] ?? result).trim();

    let page;
    try {
      page = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse LLM response as JSON:', result.substring(0, 500));
      return NextResponse.json({ error: 'AI returned invalid JSON. Try again or use a different model.' }, { status: 502 });
    }

    page.createdAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();

    return NextResponse.json(page);
  } catch (err: unknown) {
    console.error('Generate error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
