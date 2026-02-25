'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateFromPrompt } from '@landing-builder/core';
import { mockAdapter } from '@/lib/mock-adapter';

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const page = await generateFromPrompt({ prompt, llm: mockAdapter });
      localStorage.setItem('lb-current-page', JSON.stringify(page));
      router.push('/editor');
    } catch (err) {
      console.error(err);
      alert('Generation failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 640, width: '100%', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>✨ Generate Landing Page</h1>
        <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Describe what you want and AI will build it for you.</p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Landing page for a yoga studio with pricing, testimonials, team section, and a booking CTA"
          rows={5}
          style={{ width: '100%', padding: '1rem', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{ padding: '0.75rem 2rem', background: loading ? '#9ca3af' : '#3b82f6', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? '⏳ Generating...' : '🚀 Generate'}
          </button>
          <a href="/" style={{ opacity: 0.6 }}>← Back</a>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#eff6ff', borderRadius: 8, fontSize: '0.875rem' }}>
          <strong>💡 Try these:</strong>
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', lineHeight: 2 }}>
            {[
              'Landing page for a SaaS file sync product with pricing and FAQ',
              'Italian restaurant with gallery, testimonials, and reservation form',
              'Personal portfolio for a product designer',
              'Yoga studio with class pricing and instructor profiles',
            ].map((s, i) => (
              <li key={i}>
                <button onClick={() => setPrompt(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit' }}>{s}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
