import type { FC } from 'react';
import React from 'react';
import type { CtaProps, BlockDefinition } from '@landing-builder/core';

const Cta: FC<CtaProps> = ({ headline, subheadline, buttonText, buttonUrl, variant = 'simple' }) => (
  <section className="px-6 py-24 md:py-32">
    <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900" />
      {/* Mesh overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" />
      </div>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h30v30H0z\' fill=\'none\' stroke=\'white\' stroke-width=\'0.5\'/%3E%3C/svg%3E")' }} />

      <div className="relative px-8 py-16 md:px-16 md:py-24 text-center text-white">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">{headline}</h2>
        {subheadline && <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">{subheadline}</p>}
        {variant === 'with-input' ? (
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm" />
            <a href={buttonUrl} className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">{buttonText}</a>
          </div>
        ) : (
          <a href={buttonUrl} className="group inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-white/10 hover:-translate-y-0.5 transition-all duration-300">
            {buttonText}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        )}
      </div>
    </div>
  </section>
);

export const CtaBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'cta', label: 'Call to Action', icon: '📣', category: 'conversion',
  renderer: Cta as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Ready to get started?', subheadline: 'Join 50,000+ teams building better products. Free 14-day trial, no credit card required.', buttonText: 'Start Free Trial', buttonUrl: '#', variant: 'simple' },
};
