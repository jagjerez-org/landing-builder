import type { FC } from 'react';
import React from 'react';
import type { FeaturesProps, BlockDefinition } from '@landing-builder/core';

const Features: FC<FeaturesProps> = ({ headline, subheadline, features, columns = 3 }) => (
  <div style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center' }}>{headline}</h2>
    {subheadline && <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '2rem' }}>{subheadline}</p>}
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '2rem', marginTop: '2rem' }}>
      {features.map((f, i) => (
        <div key={i} style={{ padding: '1.5rem', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '2rem' }}>{f.icon}</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.5rem 0' }}>{f.title}</h3>
          <p style={{ opacity: 0.7 }}>{f.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export const FeaturesBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'features',
  label: 'Features',
  icon: '✨',
  category: 'content',
  renderer: Features as unknown as FC<Record<string, unknown>>,
  defaultProps: {
    headline: 'Why choose us',
    features: [
      { icon: '⚡', title: 'Fast', description: 'Lightning fast performance' },
      { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
      { icon: '🎨', title: 'Beautiful', description: 'Pixel-perfect design' },
    ],
    columns: 3,
  },
};
