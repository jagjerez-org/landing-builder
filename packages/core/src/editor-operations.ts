/**
 * Editor Operations — pure functions for manipulating LandingPage state.
 * Used by framework-specific editors (React, Vue, Angular) as the logic layer.
 */

import type { LandingPage, Section, SectionType } from './schema.js';

/** Add a section at a specific position (or end) */
export function addSection(
  page: LandingPage,
  section: Omit<Section, 'order'>,
  position?: number,
): LandingPage {
  const order = position ?? page.sections.length;
  const newSections = [...page.sections];
  newSections.splice(order, 0, { ...section, order });

  return {
    ...page,
    sections: reorder(newSections),
    updatedAt: new Date().toISOString(),
  };
}

/** Remove a section by id */
export function removeSection(page: LandingPage, sectionId: string): LandingPage {
  return {
    ...page,
    sections: reorder(page.sections.filter((s) => s.id !== sectionId)),
    updatedAt: new Date().toISOString(),
  };
}

/** Move a section to a new position */
export function moveSection(page: LandingPage, sectionId: string, newPosition: number): LandingPage {
  const idx = page.sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return page;

  const newSections = [...page.sections];
  const [moved] = newSections.splice(idx, 1);
  newSections.splice(newPosition, 0, moved);

  return {
    ...page,
    sections: reorder(newSections),
    updatedAt: new Date().toISOString(),
  };
}

/** Update a section's props (shallow merge) */
export function updateSectionProps(
  page: LandingPage,
  sectionId: string,
  props: Record<string, unknown>,
): LandingPage {
  return {
    ...page,
    sections: page.sections.map((s) =>
      s.id === sectionId ? { ...s, props: { ...s.props, ...props } } : s,
    ),
    updatedAt: new Date().toISOString(),
  };
}

/** Update a section's style */
export function updateSectionStyle(
  page: LandingPage,
  sectionId: string,
  style: Section['style'],
): LandingPage {
  return {
    ...page,
    sections: page.sections.map((s) =>
      s.id === sectionId ? { ...s, style: { ...s.style, ...style } } : s,
    ),
    updatedAt: new Date().toISOString(),
  };
}

/** Toggle section visibility */
export function toggleSection(page: LandingPage, sectionId: string): LandingPage {
  return {
    ...page,
    sections: page.sections.map((s) =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s,
    ),
    updatedAt: new Date().toISOString(),
  };
}

/** Duplicate a section (placed right after the original) */
export function duplicateSection(page: LandingPage, sectionId: string): LandingPage {
  const idx = page.sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return page;

  const original = page.sections[idx];
  const clone: Section = {
    ...JSON.parse(JSON.stringify(original)),
    id: `${original.id}-copy-${Date.now()}`,
  };

  const newSections = [...page.sections];
  newSections.splice(idx + 1, 0, clone);

  return {
    ...page,
    sections: reorder(newSections),
    updatedAt: new Date().toISOString(),
  };
}

/** Get available section types not yet used (for "add section" UI) */
export function getUnusedSectionTypes(page: LandingPage): SectionType[] {
  const all: SectionType[] = [
    'hero', 'features', 'pricing', 'testimonials', 'cta',
    'faq', 'gallery', 'stats', 'team', 'contact', 'footer',
  ];
  const used = new Set(page.sections.map((s) => s.type));
  return all.filter((t) => !used.has(t));
}

// ─── Helpers ────────────────────────────────────────────

function reorder(sections: Section[]): Section[] {
  return sections.map((s, i) => ({ ...s, order: i }));
}
