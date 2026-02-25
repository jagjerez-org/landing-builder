import type { FC } from 'react';
import React from 'react';
import type { TeamProps, BlockDefinition } from '@landing-builder/core';

const Team: FC<TeamProps> = ({ headline, subheadline, members }) => (
  <div style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{headline}</h2>
    {subheadline && <p style={{ opacity: 0.7, marginBottom: '2rem' }}>{subheadline}</p>}
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(members.length, 4)}, 1fr)`, gap: '2rem', marginTop: '2rem' }}>
      {members.map((m, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          {m.avatar ? <img src={m.avatar} alt={m.name} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem' }} /> : <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#e5e7eb', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{m.name[0]}</div>}
          <h3 style={{ fontWeight: 600, margin: '0.25rem 0' }}>{m.name}</h3>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>{m.role}</p>
          {m.bio && <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>{m.bio}</p>}
        </div>
      ))}
    </div>
  </div>
);

export const TeamBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'team', label: 'Team', icon: '👥', category: 'content',
  renderer: Team as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Meet the team', members: [
    { name: 'Alex Kim', role: 'CEO', bio: 'Visionary leader' },
    { name: 'Jordan Lee', role: 'CTO', bio: 'Tech architect' },
    { name: 'Sam Patel', role: 'Design Lead', bio: 'Pixel perfectionist' },
  ]},
};
