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
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export async function POST(req: Request) {
  try {
    const body: GenerateRequest = await req.json();
    const { prompt, locale, provider, apiKey, baseUrl, model } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let userMessage = prompt;
    if (locale && locale !== 'en') {
      userMessage += `\n\nIMPORTANT: Generate ALL text content in ${locale}. Everything must be in ${locale}.`;
    }

    let result: string;

    switch (provider) {
      case 'openai':
      case 'ollama':
      case 'custom': {
        const key = apiKey || process.env.OPENAI_API_KEY;
        const url = baseUrl || (provider === 'ollama' ? 'http://localhost:11434/v1' : 'https://api.openai.com/v1');
        const mdl = model || (provider === 'ollama' ? 'llama3.1' : 'gpt-4o-mini');

        if (!key && provider !== 'ollama') {
          return NextResponse.json({ error: `No API key provided for ${provider}` }, { status: 400 });
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (key) headers['Authorization'] = `Bearer ${key}`;

        const res = await fetch(`${url}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: mdl,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 4096,
          }),
        });
        if (!res.ok) throw new Error(`${provider} API error (${res.status}): ${await res.text()}`);
        const data = await res.json();
        result = data.choices?.[0]?.message?.content ?? '';
        break;
      }

      case 'anthropic': {
        const key = apiKey || process.env.ANTHROPIC_API_KEY;
        const url = baseUrl || 'https://api.anthropic.com/v1';
        const mdl = model || 'claude-sonnet-4-20250514';

        if (!key) {
          return NextResponse.json({ error: 'No API key provided for Anthropic' }, { status: 400 });
        }

        const res = await fetch(`${url}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: mdl,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userMessage }],
          }),
        });
        if (!res.ok) throw new Error(`Anthropic API error (${res.status}): ${await res.text()}`);
        const data = await res.json();
        result = data.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('') ?? '';
        break;
      }

      case 'openclaw': {
        const url = baseUrl || 'http://localhost:18789';
        const key = apiKey;

        const res = await fetch(`${url}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(key ? { Authorization: `Bearer ${key}` } : {}),
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userMessage },
            ],
          }),
        });
        if (!res.ok) throw new Error(`OpenClaw agent error (${res.status}): ${await res.text()}`);
        const data = await res.json();
        result = data.choices?.[0]?.message?.content ?? data.response ?? JSON.stringify(data);
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    // Extract JSON
    const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = (jsonMatch?.[1] ?? result).trim();
    const page = JSON.parse(jsonStr);
    page.createdAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();

    return NextResponse.json(page);
  } catch (err: unknown) {
    console.error('Generate error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
