import type { FC } from 'react';
import React from 'react';
import type { HeroProps, BlockDefinition } from '@landing-builder/core';

const Hero: FC<HeroProps> = ({ headline, subheadline, ctaText, ctaUrl, secondaryCtaText, secondaryCtaUrl, image, layout = 'centered' }) => {
  if (layout === 'split') {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative flex flex-col md:flex-row items-center gap-12 lg:gap-20 px-6 py-24 md:py-32 max-w-7xl mx-auto">
          <div className="flex-1 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Now Available
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">{headline}</h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-xl">{subheadline}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={ctaUrl} className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--lb-primary,#3b82f6)] to-[var(--lb-secondary,#8b5cf6)] text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300">
                {ctaText}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              {secondaryCtaText && (
                <a href={secondaryCtaUrl ?? '#'} className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">{secondaryCtaText}</a>
              )}
            </div>
          </div>
          {image && (
            <div className="flex-1 animate-fade-in-up delay-200">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl" />
                <img src={image} alt="" className="relative w-full rounded-2xl shadow-2xl ring-1 ring-black/5" loading="lazy" />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (layout === 'background' && image) {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative text-center px-6 py-32 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white">{headline}</h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-10">{subheadline}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={ctaUrl} className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">{ctaText}</a>
            {secondaryCtaText && <a href={secondaryCtaUrl ?? '#'} className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">{secondaryCtaText}</a>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
      <div className="relative text-center px-6 py-28 md:py-40 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium text-blue-700 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Now Available
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight mb-8">
            <span className="gradient-text">{headline}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-12">{subheadline}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={ctaUrl} className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[var(--lb-primary,#3b82f6)] to-[var(--lb-secondary,#8b5cf6)] text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300">
              {ctaText}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            {secondaryCtaText && <a href={secondaryCtaUrl ?? '#'} className="inline-flex items-center px-10 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">{secondaryCtaText}</a>}
          </div>
        </div>
        {image && (
          <div className="mt-20 animate-fade-in-up delay-300">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl" />
              <img src={image} alt="" className="relative w-full rounded-2xl shadow-2xl ring-1 ring-black/5" loading="lazy" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const HeroBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'hero', label: 'Hero', icon: '🦸', category: 'content',
  renderer: Hero as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Build something people love', subheadline: 'The modern platform for creating exceptional digital experiences. Fast, flexible, and designed for teams.', ctaText: 'Get Started Free', ctaUrl: '#', secondaryCtaText: 'See How It Works', secondaryCtaUrl: '#', layout: 'centered' },
};
