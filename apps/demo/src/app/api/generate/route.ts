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

gallery: { headline, images: [{ src: "https://placehold.co/800x600/COLOR/white?text=LABEL", alt, caption? }], columns: 2|3|4, layout: "grid"|"masonry" }

stats: { headline?, stats: [{ value, label, icon: "emoji" }] }

team: { headline, subheadline?, members: [{ name, role, avatar?, bio? }] }

contact: { headline, subheadline?, email?, phone?, address?, formFields: [{ type: "text"|"email"|"tel"|"textarea"|"select", name, label, placeholder?, required?, options?: string[] }] }

embed: { url, type: "iframe"|"video"|"map"|"calendar", aspectRatio: "16:9"|"4:3"|"1:1" }

spacer: { height: "css value" }

divider: { color?, thickness?, style: "solid"|"dashed"|"dotted" }

RULES:
1. Generate REAL, compelling copy — professional marketing quality. NO lorem ipsum.
2. Use a cohesive color scheme that matches the business type
3. Choose sections that make sense for the described business
4. Always start with hero, end with footer
5. Generate 5-8 sections for a complete page
6. For images, use placehold.co with relevant colors: https://placehold.co/800x600/HEX/white?text=Relevant+Label (no # in hex)
7. Match the tone to the business (playful for creative, professional for B2B, warm for hospitality)
8. Include realistic pricing if relevant
9. Generate 3-5 testimonials with realistic names and roles
10. FAQ should have 4-6 real questions someone would ask
11. Stats should use impressive but believable numbers`;

export async function POST(req: Request) {
  try {
    const { prompt, locale } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Try OpenAI first, fall back to the configured model
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.LLM_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key configured. Set OPENAI_API_KEY env var.' }, { status: 500 });
    }

    let userMessage = prompt;
    if (locale && locale !== 'en') {
      userMessage += `\n\nIMPORTANT: Generate ALL text content in ${locale}. Headlines, descriptions, button text, testimonials, FAQ — everything must be in ${locale}.`;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('LLM error:', err);
      return NextResponse.json({ error: `LLM request failed: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    // Extract JSON (handle possible markdown fences)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = (jsonMatch?.[1] ?? content).trim();

    const page = JSON.parse(jsonStr);
    page.createdAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();

    return NextResponse.json(page);
  } catch (err: unknown) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
