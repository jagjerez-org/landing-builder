import type { FC } from 'react';
import React, { useState } from 'react';
import type { FaqProps, BlockDefinition } from '@landing-builder/core';

const Faq: FC<FaqProps> = ({ headline, items }) => {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const toggle = (i: number) => setOpen((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16 animate-fade-in-up">{headline}</h2>
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open.has(i);
            return (
              <div key={i} className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'border-blue-200 bg-blue-50/30 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <button onClick={() => toggle(i)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="text-lg font-semibold text-gray-900 pr-4">{item.question}</span>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-blue-500 text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-6 text-gray-500 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
