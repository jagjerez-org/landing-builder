import type { FC } from 'react';
import React from 'react';
import type { CtaProps, BlockDefinition } from '@landing-builder/core';

const Cta: FC<CtaProps> = ({ headline, subheadline, buttonText, buttonUrl, variant = 'simple' }) => (
  <div className="px-6 py-20 md:py-28">
    <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-12 md:p-16 text-center text-white shadow-2xl shadow-blue-500/20">
      <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{headline}</h2>
      {subheadline && <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{subheadline}</p>}
      {variant === 'with-input' ? (
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50" />
          <a href={buttonUrl} className="px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">{buttonText}</a>
        </div>
      ) : (
        <a href={buttonUrl} className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">{buttonText}</a>
      )}
    </div>
  </div>
);

export const CtaBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'cta', label: 'Call to Action', icon: '📣', category: 'conversion',
  renderer: Cta as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Ready to get started?', subheadline: 'Join 50,000+ teams building better products. Free 14-day trial, no credit card required.', buttonText: 'Start Free Trial', buttonUrl: '#', variant: 'simple' },
};
