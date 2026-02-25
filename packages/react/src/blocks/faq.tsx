import type { FC } from 'react';
import React, { useState } from 'react';
import type { FaqProps, BlockDefinition } from '@landing-builder/core';

const Faq: FC<FaqProps> = ({ headline, items }) => {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const toggle = (i: number) => setOpen((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="px-6 py-20 md:py-28 max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">{headline}</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden transition-colors hover:border-gray-300">
            <button onClick={() => toggle(i)} className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors">
              <span className="text-lg font-semibold text-gray-900 pr-4">{item.question}</span>
              <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open.has(i) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${open.has(i) ? 'max-h-96' : 'max-h-0'}`}>
              <p className="px-6 pb-6 text-gray-500 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FaqBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'faq', label: 'FAQ', icon: '❓', category: 'social-proof',
  renderer: Faq as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Frequently asked questions', items: [
    { question: 'How does the free trial work?', answer: 'You get full access to all Pro features for 14 days. No credit card required. At the end, choose a plan or downgrade to the free tier.' },
    { question: 'Can I cancel anytime?', answer: 'Absolutely. No contracts, no cancellation fees. Cancel with one click from your dashboard.' },
    { question: 'Do you offer custom enterprise plans?', answer: 'Yes! Contact our sales team for custom pricing, SLA guarantees, and dedicated support for teams of 50+.' },
    { question: 'Is my data secure?', answer: 'We use AES-256 encryption at rest and TLS 1.3 in transit. SOC 2 Type II certified with annual penetration testing.' },
  ]},
};
