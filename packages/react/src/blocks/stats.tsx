import type { FC } from 'react';
import React from 'react';
import type { StatsProps, BlockDefinition } from '@landing-builder/core';

const Stats: FC<StatsProps> = ({ headline, stats }) => (
  <section className="px-6 py-24 md:py-32">
    <div className="max-w-6xl mx-auto">
      {headline && <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16 animate-fade-in-up">{headline}</h2>}
      <div className={`grid grid-cols-2 gap-8 md:gap-12 ${stats.length >= 4 ? 'grid-cols-dynamic-4' : stats.length === 3 ? 'grid-cols-dynamic-3' : 'grid-cols-dynamic-2'}`}>
        {stats.map((s, i) => (
          <div key={i} className="relative text-center p-8 rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 card-hover group">
            {s.icon && <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>}
            <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text leading-none mb-3">{s.value}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const StatsBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'stats', label: 'Stats', icon: '📊', category: 'content',
  renderer: Stats as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Trusted by thousands', stats: [
    { value: '50K+', label: 'Active Users', icon: '👥' },
    { value: '99.99%', label: 'Uptime', icon: '⚡' },
    { value: '150+', label: 'Countries', icon: '🌍' },
    { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
  ]},
};
