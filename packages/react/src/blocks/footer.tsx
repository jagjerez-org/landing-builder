import type { FC } from 'react';
import React from 'react';
import type { FooterProps, BlockDefinition } from '@landing-builder/core';

const Footer: FC<FooterProps> = ({ tagline, links, socials, copyright }) => (
  <footer style={{ padding: '3rem 2rem', borderTop: '1px solid #e5e7eb', maxWidth: 1200, margin: '0 auto' }}>
    {tagline && <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{tagline}</p>}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '1.5rem' }}>
      {Object.entries(links.reduce<Record<string, typeof links>>((acc, l) => { (acc[l.group || 'Links'] ??= []).push(l); return acc; }, {})).map(([group, groupLinks]) => (
        <div key={group}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', opacity: 0.6, textTransform: 'uppercase' }}>{group}</h4>
          {groupLinks.map((l, i) => <a key={i} href={l.url} style={{ display: 'block', textDecoration: 'none', color: 'inherit', opacity: 0.8, padding: '0.15rem 0', fontSize: '0.9rem' }}>{l.label}</a>)}
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.875rem', opacity: 0.6 }}>
      <span>{copyright}</span>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {socials.map((s, i) => <a key={i} href={s.url} style={{ textDecoration: 'none', color: 'inherit' }}>{s.platform}</a>)}
      </div>
    </div>
  </footer>
);

export const FooterBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'footer', label: 'Footer', icon: '🔗', category: 'navigation',
  renderer: Footer as FC<Record<string, unknown>>,
  defaultProps: { tagline: 'Built with Landing Builder', links: [
    { label: 'Home', url: '#', group: 'Product' }, { label: 'Features', url: '#features', group: 'Product' },
    { label: 'Pricing', url: '#pricing', group: 'Product' }, { label: 'Privacy', url: '#', group: 'Legal' },
    { label: 'Terms', url: '#', group: 'Legal' },
  ], socials: [{ platform: 'Twitter', url: '#' }, { platform: 'GitHub', url: '#' }], copyright: '© 2026 Company. All rights reserved.' },
};
