/**
 * Prompt Engine — converts a user prompt into a LandingPage JSON.
 */

import type { LandingPage, SectionType, ThemeConfig } from './schema.js';
import type { LlmAdapter } from './llm-adapter.js';

export interface GenerateOptions {
  /** User's description of what they want */
  prompt: string;

  /** LLM adapter to use */
  llm: LlmAdapter;

  /** Theme preset or partial config */
  theme?: Partial<ThemeConfig>;

  /** Restrict to these section types only */
  allowedSections?: SectionType[];

  /** Language for generated content */
  locale?: string;
}

const SYSTEM_PROMPT = `You are a landing page architect. Given a user description, generate a complete landing page as JSON.

RULES:
- Output ONLY valid JSON matching the LandingPage schema (no markdown, no explanation)
- Generate realistic, compelling copy — not lorem ipsum
- Pick sections that make sense for the described business/product
- Use a logical section order (hero first, footer last)
- Generate 4-8 sections unless the user specifies otherwise
- All IDs must be unique lowercase kebab-case strings

SCHEMA:
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "meta": { "title": "string", "description": "string" },
  "theme": {
    "preset": "string",
    "colors": { "primary": "#hex", "secondary": "#hex", "background": "#hex", "text": "#hex", "accent": "#hex" },
    "fonts": { "heading": "string", "body": "string" },
    "borderRadius": "none|sm|md|lg|full",
    "spacing": "compact|normal|relaxed"
  },
  "sections": [
    {
      "id": "string",
      "type": "hero|features|pricing|testimonials|cta|faq|gallery|stats|team|contact|footer|custom",
      "order": number,
      "visible": true,
      "props": { ... type-specific props },
      "style": { "backgroundColor": "#hex (optional)" }
    }
  ],
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}

Section prop schemas:
- hero: { headline, subheadline, ctaText, ctaUrl, secondaryCtaText?, secondaryCtaUrl?, image?, layout: "centered"|"split"|"background" }
- features: { headline, subheadline?, features: [{ icon, title, description }], columns: 2|3|4 }
- pricing: { headline, subheadline?, tiers: [{ name, price, period, features: string[], ctaText, ctaUrl, highlighted }] }
- testimonials: { headline, testimonials: [{ quote, author, role, avatar?, rating? }], layout: "grid"|"carousel"|"stack" }
- cta: { headline, subheadline?, buttonText, buttonUrl, variant: "simple"|"with-input"|"split" }
- faq: { headline, items: [{ question, answer }] }
- footer: { logo?, tagline?, links: [{ label, url, group? }], socials: [{ platform, url }], copyright }`;

export async function generateFromPrompt(options: GenerateOptions): Promise<LandingPage> {
  const { prompt, llm, theme, allowedSections, locale } = options;

  let userMessage = prompt;

  if (allowedSections?.length) {
    userMessage += `\n\nOnly use these section types: ${allowedSections.join(', ')}`;
  }
  if (locale) {
    userMessage += `\n\nGenerate all text content in: ${locale}`;
  }
  if (theme) {
    userMessage += `\n\nUse this theme configuration: ${JSON.stringify(theme)}`;
  }

  const raw = await llm.complete([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ]);

  // Extract JSON from response (handle markdown fences)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
  const jsonStr = (jsonMatch[1] ?? raw).trim();

  const page = JSON.parse(jsonStr) as LandingPage;

  // Apply theme overrides
  if (theme) {
    page.theme = { ...page.theme, ...theme, colors: { ...page.theme.colors, ...theme.colors } };
  }

  return page;
}
