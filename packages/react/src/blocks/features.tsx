import type { FC } from 'react';
import React from 'react';
import type { FeaturesProps, BlockDefinition } from '@landing-builder/core';

const Features: FC<FeaturesProps> = ({ headline, subheadline, features, columns = 3 }) => (
  <div className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{headline}</h2>
      {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subheadline}</p>}
    </div>
    <div className={`grid gap-8 md:grid-cols-${columns}`}>
      {features.map((f, i) => (
        <div key={i} className="group relative p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-50 text-2xl mb-5 group-hover:scale-110 transition-transform">{f.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-gray-500 leading-relaxed">{f.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export const FeaturesBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'features', label: 'Features', icon: '✨', category: 'content',
  renderer: Features as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Everything you need to succeed', subheadline: 'Powerful tools that scale with your ambition', features: [
    { icon: '⚡', title: 'Lightning Fast', description: 'Optimized for speed with edge computing and smart caching. Your users feel the difference.' },
    { icon: '🔒', title: 'Enterprise Security', description: 'SOC 2 compliant, end-to-end encrypted, with role-based access control built in.' },
    { icon: '🎨', title: 'Beautiful by Default', description: 'Professionally designed components that look great out of the box. Customize everything.' },
  ], columns: 3 },
};
