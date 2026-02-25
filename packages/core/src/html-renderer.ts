/**
 * HTML Renderer — generates static HTML from a LandingPage.
 * This is the framework-agnostic output. Any framework can also use this as fallback.
 */

import type {
  LandingPage,
  Section,
  HeroProps,
  FeaturesProps,
  PricingProps,
  TestimonialsProps,
  CtaProps,
  FaqProps,
  FooterProps,
} from './schema.js';

export interface RenderHtmlOptions {
  /** Include inline <style> with theme CSS variables */
  includeStyles?: boolean;
  /** Include a wrapping <!DOCTYPE html> document */
  fullDocument?: boolean;
  /** Custom CSS to inject */
  customCss?: string;
}

export function renderToHtml(page: LandingPage, options: RenderHtmlOptions = {}): string {
  const { includeStyles = true, fullDocument = false, customCss = '' } = options;

  const { theme } = page;
  const cssVars = `
    --lb-primary: ${theme.colors.primary};
    --lb-secondary: ${theme.colors.secondary};
    --lb-bg: ${theme.colors.background};
    --lb-text: ${theme.colors.text};
    --lb-accent: ${theme.colors.accent};
    --lb-font-heading: ${theme.fonts.heading}, system-ui, sans-serif;
    --lb-font-body: ${theme.fonts.body}, system-ui, sans-serif;
    --lb-radius: ${radiusMap[theme.borderRadius]};
  `.trim();

  const sectionsHtml = page.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((s) => renderSection(s))
    .join('\n');

  const styleBlock = includeStyles
    ? `<style>
  :root { ${cssVars} }
  .lb-page { font-family: var(--lb-font-body); color: var(--lb-text); background: var(--lb-bg); }
  .lb-page h1, .lb-page h2, .lb-page h3 { font-family: var(--lb-font-heading); }
  .lb-section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
  .lb-btn { display: inline-block; padding: 0.75rem 1.5rem; background: var(--lb-primary); color: white; border-radius: var(--lb-radius); text-decoration: none; font-weight: 600; }
  .lb-btn-secondary { background: transparent; border: 2px solid var(--lb-primary); color: var(--lb-primary); }
  .lb-grid { display: grid; gap: 2rem; }
  .lb-grid-2 { grid-template-columns: repeat(2, 1fr); }
  .lb-grid-3 { grid-template-columns: repeat(3, 1fr); }
  .lb-grid-4 { grid-template-columns: repeat(4, 1fr); }
  .lb-card { padding: 1.5rem; border-radius: var(--lb-radius); border: 1px solid #e5e7eb; }
  .lb-card-highlighted { border-color: var(--lb-primary); box-shadow: 0 0 0 2px var(--lb-primary); }
  ${customCss}
</style>`
    : '';

  const body = `<div class="lb-page">${styleBlock}${sectionsHtml}</div>`;

  if (fullDocument) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(page.meta.title)}</title>
  <meta name="description" content="${escHtml(page.meta.description)}">
</head>
<body>${body}</body>
</html>`;
  }

  return body;
}

// ─── Section Renderers ──────────────────────────────────

function renderSection(section: Section): string {
  const style = section.style?.backgroundColor ? ` style="background:${section.style.backgroundColor}"` : '';
  const inner = sectionRenderers[section.type]?.(section.props as never) ?? '';
  return `<section id="${section.id}" class="lb-section lb-section--${section.type}"${style}>${inner}</section>`;
}

const sectionRenderers: Record<string, (props: never) => string> = {
  hero: (p: HeroProps) => `
    <div class="lb-hero lb-hero--${p.layout}">
      <h1>${escHtml(p.headline)}</h1>
      <p>${escHtml(p.subheadline)}</p>
      <div>
        <a href="${escHtml(p.ctaUrl)}" class="lb-btn">${escHtml(p.ctaText)}</a>
        ${p.secondaryCtaText ? `<a href="${escHtml(p.secondaryCtaUrl ?? '#')}" class="lb-btn lb-btn-secondary">${escHtml(p.secondaryCtaText)}</a>` : ''}
      </div>
      ${p.image ? `<img src="${escHtml(p.image)}" alt="" loading="lazy">` : ''}
    </div>`,

  features: (p: FeaturesProps) => `
    <h2>${escHtml(p.headline)}</h2>
    ${p.subheadline ? `<p>${escHtml(p.subheadline)}</p>` : ''}
    <div class="lb-grid lb-grid-${p.columns}">
      ${p.features.map((f) => `<div class="lb-card"><span>${escHtml(f.icon)}</span><h3>${escHtml(f.title)}</h3><p>${escHtml(f.description)}</p></div>`).join('')}
    </div>`,

  pricing: (p: PricingProps) => `
    <h2>${escHtml(p.headline)}</h2>
    ${p.subheadline ? `<p>${escHtml(p.subheadline)}</p>` : ''}
    <div class="lb-grid lb-grid-${p.tiers.length}">
      ${p.tiers.map((t) => `<div class="lb-card ${t.highlighted ? 'lb-card-highlighted' : ''}"><h3>${escHtml(t.name)}</h3><div class="lb-price">${escHtml(t.price)}<span>/${escHtml(t.period)}</span></div><ul>${t.features.map((f) => `<li>${escHtml(f)}</li>`).join('')}</ul><a href="${escHtml(t.ctaUrl)}" class="lb-btn">${escHtml(t.ctaText)}</a></div>`).join('')}
    </div>`,

  testimonials: (p: TestimonialsProps) => `
    <h2>${escHtml(p.headline)}</h2>
    <div class="lb-grid lb-grid-${Math.min(p.testimonials.length, 3)}">
      ${p.testimonials.map((t) => `<blockquote class="lb-card"><p>"${escHtml(t.quote)}"</p><footer><strong>${escHtml(t.author)}</strong> — ${escHtml(t.role)}${t.rating ? ` ${'★'.repeat(t.rating)}` : ''}</footer></blockquote>`).join('')}
    </div>`,

  cta: (p: CtaProps) => `
    <div class="lb-cta lb-cta--${p.variant}">
      <h2>${escHtml(p.headline)}</h2>
      ${p.subheadline ? `<p>${escHtml(p.subheadline)}</p>` : ''}
      <a href="${escHtml(p.buttonUrl)}" class="lb-btn">${escHtml(p.buttonText)}</a>
    </div>`,

  faq: (p: FaqProps) => `
    <h2>${escHtml(p.headline)}</h2>
    <div>
      ${p.items.map((item) => `<details class="lb-card"><summary>${escHtml(item.question)}</summary><p>${escHtml(item.answer)}</p></details>`).join('')}
    </div>`,

  footer: (p: FooterProps) => `
    <footer class="lb-footer">
      ${p.tagline ? `<p>${escHtml(p.tagline)}</p>` : ''}
      <nav>${p.links.map((l) => `<a href="${escHtml(l.url)}">${escHtml(l.label)}</a>`).join(' · ')}</nav>
      <div>${p.socials.map((s) => `<a href="${escHtml(s.url)}">${escHtml(s.platform)}</a>`).join(' ')}</div>
      <p>${escHtml(p.copyright)}</p>
    </footer>`,
};

const radiusMap: Record<string, string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
};

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
