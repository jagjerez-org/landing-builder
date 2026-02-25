import type { FC } from 'react';
import React from 'react';
import type { HeroProps, BlockDefinition } from '@landing-builder/core';

const Hero: FC<HeroProps> = ({ headline, subheadline, ctaText, ctaUrl, secondaryCtaText, secondaryCtaUrl, image, layout = 'centered' }) => (
  <div style={{ textAlign: layout === 'centered' ? 'center' : 'left', padding: '4rem 2rem' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>{headline}</h1>
    <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '2rem', maxWidth: 600, margin: layout === 'centered' ? '0 auto 2rem' : undefined }}>{subheadline}</p>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: layout === 'centered' ? 'center' : 'flex-start' }}>
      <a href={ctaUrl} style={{ padding: '0.75rem 1.5rem', background: 'var(--lb-primary, #3b82f6)', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>{ctaText}</a>
      {secondaryCtaText && (
        <a href={secondaryCtaUrl ?? '#'} style={{ padding: '0.75rem 1.5rem', border: '2px solid var(--lb-primary, #3b82f6)', color: 'var(--lb-primary, #3b82f6)', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>{secondaryCtaText}</a>
      )}
    </div>
    {image && <img src={image} alt="" style={{ maxWidth: '100%', marginTop: '2rem' }} loading="lazy" />}
  </div>
);

export const HeroBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'hero',
  label: 'Hero',
  icon: '🦸',
  category: 'content',
  renderer: Hero as unknown as FC<Record<string, unknown>>,
  defaultProps: {
    headline: 'Welcome to our platform',
    subheadline: 'Build something amazing today',
    ctaText: 'Get Started',
    ctaUrl: '#',
    layout: 'centered',
  },
};
