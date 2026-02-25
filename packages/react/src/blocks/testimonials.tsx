import type { FC } from 'react';
import React from 'react';
import type { TestimonialsProps, BlockDefinition } from '@landing-builder/core';

const Testimonials: FC<TestimonialsProps> = ({ headline, testimonials, layout = 'grid' }) => (
  <div style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>{headline}</h2>
    <div style={{ display: layout === 'stack' ? 'flex' : 'grid', flexDirection: layout === 'stack' ? 'column' : undefined, gridTemplateColumns: layout === 'grid' ? `repeat(${Math.min(testimonials.length, 3)}, 1fr)` : undefined, gap: '1.5rem' }}>
      {testimonials.map((t, i) => (
        <blockquote key={i} style={{ padding: '1.5rem', borderRadius: 12, border: '1px solid #e5e7eb', margin: 0, background: '#fafafa' }}>
          {t.rating && <div style={{ marginBottom: '0.5rem' }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>}
          <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{t.quote}"</p>
          <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {t.avatar && <img src={t.avatar} alt={t.author} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
            <div><strong>{t.author}</strong><br /><span style={{ opacity: 0.6, fontSize: '0.875rem' }}>{t.role}</span></div>
          </footer>
        </blockquote>
      ))}
    </div>
  </div>
);

export const TestimonialsBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'testimonials', label: 'Testimonials', icon: '💬', category: 'social-proof',
  renderer: Testimonials as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'What our customers say', layout: 'grid', testimonials: [
    { quote: 'This product changed everything for us.', author: 'Sarah Chen', role: 'CEO at TechCo', rating: 5 },
    { quote: 'Incredible experience from start to finish.', author: 'Marcus Johnson', role: 'Founder', rating: 5 },
    { quote: 'Best tool we\'ve adopted this year.', author: 'Ana Rodriguez', role: 'CTO', rating: 4 },
  ]},
};
