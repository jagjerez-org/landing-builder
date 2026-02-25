/**
 * LandingRenderer — renders a LandingPage using registered React blocks.
 */

import type { FC } from 'react';
import React from 'react';
import type { LandingPage, Section } from '@landing-builder/core';
import { renderToHtml } from '@landing-builder/core';
import { getBlock } from './blocks/index';

export interface LandingRendererProps {
  page: LandingPage;
  /** Use native React components (true) or dangerouslySetInnerHTML (false/default) */
  useComponents?: boolean;
  /** Class name for the wrapper */
  className?: string;
}

export const LandingRenderer: FC<LandingRendererProps> = ({ page, useComponents = true, className }) => {
  if (!useComponents) {
    const html = renderToHtml(page, { includeStyles: true });
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const sorted = [...page.sections].filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className={className} style={themeToStyle(page)}>
      {sorted.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
};

const SectionRenderer: FC<{ section: Section }> = ({ section }) => {
  const block = getBlock(section.type);
  if (!block) {
    return (
      <div style={{ padding: '2rem', background: '#fee', border: '1px solid #f00' }}>
        Unknown section type: {section.type}
      </div>
    );
  }

  const Component = block.renderer as FC<Record<string, unknown>>;
  return (
    <section id={section.id} style={section.style ? sectionStyle(section.style) : undefined}>
      <Component {...section.props} />
    </section>
  );
};

function themeToStyle(page: LandingPage): React.CSSProperties {
  return {
    '--lb-primary': page.theme.colors.primary,
    '--lb-secondary': page.theme.colors.secondary,
    '--lb-bg': page.theme.colors.background,
    '--lb-text': page.theme.colors.text,
    '--lb-accent': page.theme.colors.accent,
    fontFamily: `${page.theme.fonts.body}, system-ui, sans-serif`,
    color: page.theme.colors.text,
    background: page.theme.colors.background,
  } as React.CSSProperties;
}

function sectionStyle(style: Section['style']): React.CSSProperties {
  return {
    backgroundColor: style?.backgroundColor,
    backgroundImage: style?.backgroundImage ? `url(${style.backgroundImage})` : undefined,
    padding: style?.padding ?? '4rem 2rem',
    maxWidth: style?.maxWidth ?? '1200px',
    margin: '0 auto',
  };
}
