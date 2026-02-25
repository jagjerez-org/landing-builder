import type { FC } from 'react';
import React, { useState } from 'react';
import type { FaqProps, BlockDefinition } from '@landing-builder/core';

const Faq: FC<FaqProps> = ({ headline, items }) => {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setOpen((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>{headline}</h2>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
          <button onClick={() => toggle(i)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
            {item.question}
            <span style={{ transform: open.has(i) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </button>
          {open.has(i) && <p style={{ margin: '0.75rem 0 0', opacity: 0.8, lineHeight: 1.6 }}>{item.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export const FaqBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'faq', label: 'FAQ', icon: '❓', category: 'social-proof',
  renderer: Faq as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Frequently asked questions', items: [
    { question: 'How does it work?', answer: 'Simply describe your landing page and our AI generates it. Then customize with the visual editor.' },
    { question: 'Can I export the HTML?', answer: 'Yes! Export as clean static HTML or keep the JSON to render dynamically.' },
    { question: 'Is it free?', answer: 'The core library is open source and free forever.' },
  ]},
};
