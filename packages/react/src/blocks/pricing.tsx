import type { FC } from 'react';
import React from 'react';
import type { PricingProps, BlockDefinition } from '@landing-builder/core';

const Pricing: FC<PricingProps> = ({ headline, subheadline, tiers }) => (
  <div className="px-6 py-20 md:py-28 max-w-6xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{headline}</h2>
      {subheadline && <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subheadline}</p>}
    </div>
    <div className={`grid gap-8 md:grid-cols-${Math.min(tiers.length, 4)} items-start`}>
      {tiers.map((t, i) => (
        <div key={i} className={`relative rounded-2xl p-8 ${t.highlighted ? 'bg-gradient-to-b from-blue-600 to-violet-600 text-white shadow-2xl shadow-blue-500/25 scale-105 z-10' : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg'} transition-all duration-300`}>
          {t.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">MOST POPULAR</div>}
          <h3 className={`text-xl font-semibold ${t.highlighted ? '' : 'text-gray-900'}`}>{t.name}</h3>
          <div className="mt-4 mb-6">
            <span className="text-5xl font-extrabold">{t.price}</span>
            <span className={`text-lg ${t.highlighted ? 'text-blue-200' : 'text-gray-400'}`}>/{t.period}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {t.features.map((f, j) => (
              <li key={j} className="flex items-start gap-3">
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${t.highlighted ? 'text-blue-200' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className={t.highlighted ? 'text-blue-100' : 'text-gray-600'}>{f}</span>
              </li>
            ))}
          </ul>
          <a href={t.ctaUrl} className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all ${t.highlighted ? 'bg-white text-blue-600 hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5'}`}>{t.ctaText}</a>
        </div>
      ))}
    </div>
  </div>
);

export const PricingBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'pricing', label: 'Pricing', icon: '💰', category: 'conversion',
  renderer: Pricing as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Simple, transparent pricing', subheadline: 'No hidden fees. Cancel anytime. Start free.', tiers: [
    { name: 'Starter', price: '$0', period: 'mo', features: ['5 projects', 'Basic analytics', 'Community support', '1 GB storage'], ctaText: 'Start Free', ctaUrl: '#', highlighted: false },
    { name: 'Pro', price: '$29', period: 'mo', features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '100 GB storage', 'Custom domains', 'API access'], ctaText: 'Get Pro', ctaUrl: '#', highlighted: true },
    { name: 'Enterprise', price: '$99', period: 'mo', features: ['Everything in Pro', 'SSO & SAML', 'Dedicated manager', 'SLA guarantee', 'Custom integrations'], ctaText: 'Contact Sales', ctaUrl: '#', highlighted: false },
  ]},
};
