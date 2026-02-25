import type { FC } from 'react';
import React from 'react';
import type { PricingProps, BlockDefinition } from '@landing-builder/core';

const Pricing: FC<PricingProps> = ({ headline, subheadline, tiers }) => (
  <div style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{headline}</h2>
    {subheadline && <p style={{ opacity: 0.7, marginBottom: '2rem' }}>{subheadline}</p>}
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(tiers.length, 4)}, 1fr)`, gap: '1.5rem', marginTop: '2rem' }}>
      {tiers.map((t, i) => (
        <div key={i} style={{ padding: '2rem', borderRadius: 12, border: t.highlighted ? '2px solid var(--lb-primary, #3b82f6)' : '1px solid #e5e7eb', boxShadow: t.highlighted ? '0 4px 24px rgba(59,130,246,0.15)' : undefined, position: 'relative' }}>
          {t.highlighted && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--lb-primary, #3b82f6)', color: 'white', padding: '2px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>Popular</div>}
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.name}</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0' }}>{t.price}<span style={{ fontSize: '1rem', opacity: 0.6 }}>/{t.period}</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', textAlign: 'left' }}>
            {t.features.map((f, j) => <li key={j} style={{ padding: '0.25rem 0' }}>✓ {f}</li>)}
          </ul>
          <a href={t.ctaUrl} style={{ display: 'block', padding: '0.75rem', background: t.highlighted ? 'var(--lb-primary, #3b82f6)' : 'transparent', color: t.highlighted ? 'white' : 'var(--lb-primary, #3b82f6)', border: t.highlighted ? 'none' : '2px solid var(--lb-primary, #3b82f6)', borderRadius: 8, textDecoration: 'none', fontWeight: 600, textAlign: 'center' }}>{t.ctaText}</a>
        </div>
      ))}
    </div>
  </div>
);

export const PricingBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'pricing', label: 'Pricing', icon: '💰', category: 'conversion',
  renderer: Pricing as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Simple pricing', tiers: [
    { name: 'Free', price: '$0', period: 'mo', features: ['1 project', 'Basic support'], ctaText: 'Start Free', ctaUrl: '#', highlighted: false },
    { name: 'Pro', price: '$29', period: 'mo', features: ['Unlimited projects', 'Priority support', 'Analytics'], ctaText: 'Get Pro', ctaUrl: '#', highlighted: true },
    { name: 'Enterprise', price: '$99', period: 'mo', features: ['Everything in Pro', 'Custom integrations', 'SLA'], ctaText: 'Contact Us', ctaUrl: '#', highlighted: false },
  ]},
};
