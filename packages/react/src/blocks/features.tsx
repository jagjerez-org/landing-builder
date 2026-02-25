import type { FC } from 'react';
import React from 'react';
import type { FeaturesProps, BlockDefinition } from '@landing-builder/core';

const colsClass = (n: number) => n === 4 ? 'grid-cols-dynamic-4' : n === 2 ? 'grid-cols-dynamic-2' : 'grid-cols-dynamic-3';

const Features: FC<FeaturesProps> = ({ headline, subheadline, features, columns = 3 }) => (
  <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto">
    <div className="text-center mb-16 animate-fade-in-up">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{headline}</h2>
      {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{subheadline}</p>}
    </div>
    <div className={`grid gap-6 lg:gap-8 ${colsClass(columns)}`}>
      {features.map((f, i) => (
        <div key={i} className="group relative p-8 rounded-3xl bg-white border border-gray-100 card-hover overflow-hidden">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-violet-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed">{f.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
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
