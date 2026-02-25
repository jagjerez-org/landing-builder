'use client';

import { useRouter } from 'next/navigation';
import { samplePages } from '@/lib/sample-pages';

const cards = [
  { key: 'saas', icon: '☁️', title: 'SaaS Product', desc: 'CloudSync — file sync platform' },
  { key: 'restaurant', icon: '🍝', title: 'Restaurant', desc: 'La Trattoria — Italian dining' },
  { key: 'yoga', icon: '🧘', title: 'Yoga Studio', desc: 'ZenFlow — yoga & meditation' },
  { key: 'portfolio', icon: '🎨', title: 'Portfolio', desc: 'Alex Kim — product designer' },
];

export default function GalleryPage() {
  const router = useRouter();

  const openInEditor = (key: string) => {
    localStorage.setItem('lb-current-page', JSON.stringify(samplePages[key]));
    router.push('/editor');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>🖼️ Gallery</h1>
            <p style={{ opacity: 0.6 }}>Pre-built examples. Click to open in the editor.</p>
          </div>
          <a href="/" style={{ opacity: 0.6 }}>← Home</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {cards.map((c) => (
            <button
              key={c.key}
              onClick={() => openInEditor(c.key)}
              style={{ padding: '2rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{c.icon}</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{c.title}</h2>
              <p style={{ opacity: 0.6, margin: 0 }}>{c.desc}</p>
              <div style={{ marginTop: '1rem', color: '#3b82f6', fontWeight: 600, fontSize: '0.875rem' }}>Open in Editor →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
