import type { FC } from 'react';
import React from 'react';
import type { TestimonialsProps, BlockDefinition } from '@landing-builder/core';

const Testimonials: FC<TestimonialsProps> = ({ headline, testimonials, layout = 'grid' }) => (
  <div className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">{headline}</h2>
    <div className={`${layout === 'stack' ? 'flex flex-col max-w-2xl mx-auto' : `grid md:grid-cols-${Math.min(testimonials.length, 3)}`} gap-8`}>
      {testimonials.map((t, i) => (
        <blockquote key={i} className="relative p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          {t.rating && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }, (_, j) => (
                <svg key={j} className={`w-5 h-5 ${j < t.rating! ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
          )}
          <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
          <footer className="flex items-center gap-4">
            {t.avatar ? (
              <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow">{t.author[0]}</div>
            )}
            <div>
              <div className="font-semibold text-gray-900">{t.author}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          </footer>
        </blockquote>
      ))}
    </div>
  </div>
);

export const TestimonialsBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'testimonials', label: 'Testimonials', icon: '💬', category: 'social-proof',
  renderer: Testimonials as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Loved by teams worldwide', layout: 'grid', testimonials: [
    { quote: 'This product completely transformed our workflow. We shipped 3x faster in the first month.', author: 'Sarah Chen', role: 'CTO at TechCorp', rating: 5 },
    { quote: 'The best investment we made this year. Support is incredible and the product just works.', author: 'Marcus Johnson', role: 'Founder & CEO', rating: 5 },
    { quote: 'Migrated from our old system in a weekend. Wish we had switched sooner.', author: 'Ana Rodriguez', role: 'Engineering Lead', rating: 5 },
  ]},
};
