import type { FC } from 'react';
import React from 'react';
import type { CtaProps, BlockDefinition } from '@landing-builder/core';

const Cta: FC<CtaProps> = ({ headline, subheadline, buttonText, buttonUrl, variant = 'simple' }) => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--lb-primary, #3b82f6)', color: 'white', borderRadius: 12 }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{headline}</h2>
    {subheadline && <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>{subheadline}</p>}
    {variant === 'with-input' ? (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', maxWidth: 480, margin: '0 auto' }}>
        <input type="email" placeholder="Enter your email" style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 8, border: 'none' }} />
        <a href={buttonUrl} style={{ padding: '0.75rem 1.5rem', background: 'white', color: 'var(--lb-primary, #3b82f6)', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>{buttonText}</a>
      </div>
    ) : (
      <a href={buttonUrl} style={{ display: 'inline-block', padding: '0.75rem 2rem', background: 'white', color: 'var(--lb-primary, #3b82f6)', borderRadius: 8, textDecoration: 'none', fontWeight: 600, marginTop: '1rem' }}>{buttonText}</a>
    )}
  </div>
);

export const CtaBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'cta',
  label: 'Call to Action',
  icon: '📣',
  category: 'conversion',
  renderer: Cta as unknown as FC<Record<string, unknown>>,
  defaultProps: {
    headline: 'Ready to get started?',
    subheadline: 'Join thousands of happy customers today.',
    buttonText: 'Start Free Trial',
    buttonUrl: '#',
    variant: 'simple',
  },
};
