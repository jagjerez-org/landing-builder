import type { FC } from 'react';
import React from 'react';
import type { FooterProps, BlockDefinition } from '@landing-builder/core';

const Footer: FC<FooterProps> = ({ tagline, links, socials, copyright }) => {
  const groups = links.reduce<Record<string, typeof links>>((acc, l) => { (acc[l.group || 'Links'] ??= []).push(l); return acc; }, {});

  return (
    <footer className="px-6 py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-sm">
            {tagline && <div className="text-xl font-bold mb-3">{tagline}</div>}
            <div className="flex gap-4 mt-4">
              {socials.map((s, i) => (
                <a key={i} href={s.url} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors text-sm font-medium">{s.platform[0]}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-12">
            {Object.entries(groups).map(([group, groupLinks]) => (
              <div key={group}>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{group}</h4>
                <ul className="space-y-3">
                  {groupLinks.map((l, i) => <li key={i}><a href={l.url} className="text-gray-600 hover:text-gray-900 transition-colors">{l.label}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 text-sm text-gray-400">{copyright}</div>
      </div>
    </footer>
  );
};

export const FooterBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'footer', label: 'Footer', icon: '🔗', category: 'navigation',
  renderer: Footer as unknown as FC<Record<string, unknown>>,
  defaultProps: { tagline: 'Landing Builder', links: [
    { label: 'Features', url: '#', group: 'Product' }, { label: 'Pricing', url: '#', group: 'Product' }, { label: 'Changelog', url: '#', group: 'Product' },
    { label: 'Documentation', url: '#', group: 'Developers' }, { label: 'API Reference', url: '#', group: 'Developers' },
    { label: 'Privacy', url: '#', group: 'Legal' }, { label: 'Terms', url: '#', group: 'Legal' },
  ], socials: [{ platform: 'Twitter', url: '#' }, { platform: 'GitHub', url: '#' }, { platform: 'LinkedIn', url: '#' }], copyright: '© 2026 Company. All rights reserved.' },
};
