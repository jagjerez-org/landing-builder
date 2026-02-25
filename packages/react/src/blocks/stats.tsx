import type { FC } from 'react';
import React from 'react';
import type { StatsProps, BlockDefinition } from '@landing-builder/core';

const Stats: FC<StatsProps> = ({ headline, stats }) => (
  <div className="px-6 py-20 md:py-24 max-w-6xl mx-auto">
    {headline && <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">{headline}</h2>}
    <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8 md:gap-12`}>
      {stats.map((s, i) => (
        <div key={i} className="text-center">
          {s.icon && <div className="text-3xl mb-2">{s.icon}</div>}
          <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{s.value}</div>
          <div className="text-sm text-gray-500 mt-2 uppercase tracking-wider font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
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
