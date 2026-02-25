import type { FC } from 'react';
import React from 'react';
import type { PricingProps, BlockDefinition } from '@landing-builder/core';

const Pricing: FC<PricingProps> = ({ headline, subheadline, tiers }) => {
  const cols = tiers.length >= 4 ? 'grid-cols-dynamic-4' : tiers.length === 2 ? 'grid-cols-dynamic-2' : 'grid-cols-dynamic-3';
  return (
    <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{headline}</h2>
        {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{subheadline}</p>}
      </div>
      <div className={`grid gap-8 items-start ${cols}`}>
        {tiers.map((t, i) => (
          <div
            key={i}
            className={`relative rounded-3xl p-8 lg:p-10 transition-all duration-300 ${
              t.highlighted
                ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl shadow-gray-900/20 scale-[1.02] z-10 ring-1 ring-white/10'
                : 'bg-white border border-gray-200 hover:border-gray-300 card-hover'
            }`}
          >
            {t.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                MOST POPULAR
              </div>
            )}
            <h3 className={`text-lg font-semibold ${t.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>{t.name}</h3>
            <div className="mt-4 mb-8">
              <span className="text-5xl lg:text-6xl font-extrabold tracking-tight">{t.price}</span>
              <span className={`text-lg ${t.highlighted ? 'text-gray-400' : 'text-gray-400'}`}>/{t.period}</span>
            </div>
            <ul className="space-y-4 mb-10">
              {t.features.map((f, j) => (
                <li key={j} className="flex items-start gap-3">
                  <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${t.highlighted ? 'text-blue-400' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className={`${t.highlighted ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={t.ctaUrl}
              className={`block text-center py-3.5 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                t.highlighted
                  ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                  : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {t.ctaText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export const PricingBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'pricing', label: 'Pricing', icon: '💰', category: 'conversion',
  renderer: Pricing as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Simple, transparent pricing', subheadline: 'No hidden fees. Cancel anytime. Start free.', tiers: [
    { name: 'Starter', price: '$0', period: 'mo', features: ['5 projects', 'Basic analytics', 'Community support', '1 GB storage'], ctaText: 'Start Free', ctaUrl: '#', highlighted: false },
    { name: 'Pro', price: '$29', period: 'mo', features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '100 GB storage', 'Custom domains', 'API access'], ctaText: 'Get Pro', ctaUrl: '#', highlighted: true },
    { name: 'Enterprise', price: '$99', period: 'mo', features: ['Everything in Pro', 'SSO & SAML', 'Dedicated manager', 'SLA guarantee', 'Custom integrations'], ctaText: 'Contact Sales', ctaUrl: '#', highlighted: false },
  ]},
};
