'use client';

import { useRouter } from 'next/navigation';
import { samplePages } from '@/lib/sample-pages';

const cards = [
  { key: 'saas', icon: '☁️', title: 'SaaS Product', desc: 'CloudSync — File sync platform with pricing, testimonials, and FAQ', color: 'from-blue-500 to-cyan-500' },
  { key: 'restaurant', icon: '🍝', title: 'Restaurant', desc: 'La Trattoria — Italian dining with gallery, reviews, and reservation form', color: 'from-red-500 to-orange-500' },
  { key: 'yoga', icon: '🧘', title: 'Yoga Studio', desc: 'ZenFlow — Classes, instructor profiles, membership pricing', color: 'from-violet-500 to-purple-500' },
  { key: 'portfolio', icon: '🎨', title: 'Portfolio', desc: 'Alex Kim — Designer portfolio with projects, testimonials, and contact', color: 'from-gray-700 to-gray-900' },
];

export default function GalleryPage() {
  const router = useRouter();

  const openInEditor = (key: string) => {
    localStorage.setItem('lb-current-page', JSON.stringify(samplePages[key]));
    router.push('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <a href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to home</a>
            <h1 className="text-4xl font-extrabold text-slate-900 mt-3">
              <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-lg text-slate-500 mt-1">Pre-built examples. Click to open in the editor.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((c) => (
            <button key={c.key} onClick={() => openInEditor(c.key)} className="group text-left">
              <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${c.color}`} />
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${c.color} text-white text-3xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>{c.icon}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">Open in Editor →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
