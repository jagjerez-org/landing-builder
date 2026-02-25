import type { FC } from 'react';
import React from 'react';
import type { StatsProps, BlockDefinition } from '@landing-builder/core';

const Stats: FC<StatsProps> = ({ headline, stats }) => (
  <div style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
    {headline && <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>{headline}</h2>}
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: '2rem' }}>
      {stats.map((s, i) => (
        <div key={i}>
          {s.icon && <span style={{ fontSize: '2rem' }}>{s.icon}</span>}
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--lb-primary, #3b82f6)' }}>{s.value}</div>
          <div style={{ opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

export const StatsBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'stats', label: 'Stats', icon: '📊', category: 'content',
  renderer: Stats as FC<Record<string, unknown>>,
  defaultProps: { headline: 'By the numbers', stats: [
    { value: '10K+', label: 'Users', icon: '👥' },
    { value: '99.9%', label: 'Uptime', icon: '⚡' },
    { value: '150+', label: 'Countries', icon: '🌍' },
    { value: '4.9/5', label: 'Rating', icon: '⭐' },
  ]},
};
