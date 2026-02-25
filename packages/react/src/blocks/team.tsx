import type { FC } from 'react';
import React from 'react';
import type { TeamProps, BlockDefinition } from '@landing-builder/core';

const Team: FC<TeamProps> = ({ headline, subheadline, members }) => (
  <div className="px-6 py-20 md:py-28 max-w-6xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{headline}</h2>
      {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subheadline}</p>}
    </div>
    <div className={`grid gap-8 md:grid-cols-${Math.min(members.length, 4)}`}>
      {members.map((m, i) => (
        <div key={i} className="group text-center">
          {m.avatar ? (
            <img src={m.avatar} alt={m.name} className="w-28 h-28 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all shadow-md" />
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 ring-4 ring-gray-100 shadow-md">{m.name[0]}</div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{m.name}</h3>
          <p className="text-sm text-blue-600 font-medium mb-2">{m.role}</p>
          {m.bio && <p className="text-sm text-gray-500">{m.bio}</p>}
        </div>
      ))}
    </div>
  </div>
);

export const TeamBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'team', label: 'Team', icon: '👥', category: 'content',
  renderer: Team as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Meet the team', subheadline: 'The people behind the product', members: [
    { name: 'Alex Kim', role: 'CEO & Co-founder', bio: 'Previously VP Engineering at Stripe' },
    { name: 'Jordan Lee', role: 'CTO & Co-founder', bio: 'Built systems serving 100M+ users' },
    { name: 'Sam Patel', role: 'Head of Design', bio: 'Former design lead at Figma' },
  ]},
};
