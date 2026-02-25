import type { FC } from 'react';
import React from 'react';
import type { HeroProps, BlockDefinition } from '@landing-builder/core';

const Hero: FC<HeroProps> = ({ headline, subheadline, ctaText, ctaUrl, secondaryCtaText, secondaryCtaUrl, image, layout = 'centered' }) => {
  if (layout === 'split') {
    return (
      <div className="flex flex-col md:flex-row items-center gap-12 px-6 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">{headline}</h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-xl">{subheadline}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href={ctaUrl} className="inline-flex items-center px-8 py-3.5 bg-[var(--lb-primary,#3b82f6)] text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">{ctaText}</a>
            {secondaryCtaText && <a href={secondaryCtaUrl ?? '#'} className="inline-flex items-center px-8 py-3.5 border-2 border-[var(--lb-primary,#3b82f6)] text-[var(--lb-primary,#3b82f6)] rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors">{secondaryCtaText}</a>}
          </div>
        </div>
        {image && <div className="flex-1"><img src={image} alt="" className="w-full rounded-2xl shadow-2xl" loading="lazy" /></div>}
      </div>
    );
  }

  return (
    <div className="text-center px-6 py-24 md:py-32 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">{headline}</h1>
      <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">{subheadline}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href={ctaUrl} className="inline-flex items-center px-8 py-4 bg-[var(--lb-primary,#3b82f6)] text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">{ctaText}</a>
        {secondaryCtaText && <a href={secondaryCtaUrl ?? '#'} className="inline-flex items-center px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">{secondaryCtaText}</a>}
      </div>
      {image && <img src={image} alt="" className="mt-16 w-full rounded-2xl shadow-2xl" loading="lazy" />}
    </div>
  );
};

export const HeroBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'hero', label: 'Hero', icon: '🦸', category: 'content',
  renderer: Hero as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Build something people love', subheadline: 'The modern platform for creating exceptional digital experiences. Fast, flexible, and designed for teams.', ctaText: 'Get Started Free', ctaUrl: '#', secondaryCtaText: 'See How It Works', secondaryCtaUrl: '#', layout: 'centered' },
};
