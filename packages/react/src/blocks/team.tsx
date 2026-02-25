import type { FC } from 'react';
import React from 'react';
import type { TeamProps, BlockDefinition } from '@landing-builder/core';

const Team: FC<TeamProps> = ({ headline, subheadline, members }) => {
  const cols = members.length >= 4 ? 'grid-cols-dynamic-4' : members.length === 2 ? 'grid-cols-dynamic-2' : 'grid-cols-dynamic-3';
  return (
    <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{headline}</h2>
        {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{subheadline}</p>}
      </div>
      <div className={`grid gap-8 ${cols}`}>
        {members.map((m, i) => (
          <div key={i} className="group text-center p-8 rounded-3xl bg-white border border-gray-100 card-hover">
            <div className="relative inline-block mb-6">
              {m.avatar ? (
                <img src={m.avatar} alt={m.name} className="w-28 h-28 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all duration-300 shadow-lg" />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-50 shadow-lg">{m.name[0]}</div>
              )}
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
            <p className="text-sm font-medium gradient-text mb-3">{m.role}</p>
            {m.bio && <p className="text-sm text-gray-500 leading-relaxed">{m.bio}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export const TeamBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'team', label: 'Team', icon: '👥', category: 'content',
  renderer: Team as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Meet the team', subheadline: 'The people behind the product', members: [
    { name: 'Alex Kim', role: 'CEO & Co-founder', bio: 'Previously VP Engineering at Stripe' },
    { name: 'Jordan Lee', role: 'CTO & Co-founder', bio: 'Built systems serving 100M+ users' },
    { name: 'Sam Patel', role: 'Head of Design', bio: 'Former design lead at Figma' },
  ]},
};
