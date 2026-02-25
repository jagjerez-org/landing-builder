'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

const suggestions = [
  'A modern SaaS platform for team collaboration with pricing tiers, customer testimonials, and an FAQ section',
  'An Italian restaurant in Madrid with a photo gallery, wine list highlights, reservation form, and customer reviews',
  'A personal portfolio for a UX designer showcasing projects, skills, testimonials from clients, and a contact form',
  'A yoga and wellness studio with class schedules, instructor profiles, membership pricing, and a free trial CTA',
  'A fintech startup landing page with security features, comparison pricing, trust badges, and investor stats',
  'An e-commerce brand launching sneakers with hero video, product features, social proof, and limited-time offer CTA',
];

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setProgress('Sending prompt to AI...');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, locale }),
      });

      setProgress('Parsing response...');

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const page = await res.json();
      localStorage.setItem('lb-current-page', JSON.stringify(page));
      setProgress('Done! Opening editor...');
      router.push('/editor');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <a href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to home</a>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Generate</span> your landing page
          </h1>
          <p className="text-lg text-slate-500">Describe what you want. Real AI will design and build it.</p>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Describe your landing page</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A modern fintech startup that helps freelancers manage invoices, with pricing plans, security features, customer testimonials, and a free trial CTA..."
            rows={5}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300 transition-shadow"
          />

          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Language</label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {locales.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            <div className="flex-1 flex justify-end pt-5">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`px-8 py-2.5 rounded-xl font-semibold text-white transition-all ${
                  loading ? 'bg-slate-400 cursor-wait' : !prompt.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Generating...
                  </span>
                ) : '🚀 Generate'}
              </button>
            </div>
          </div>

          {progress && <p className="mt-3 text-sm text-blue-600 animate-pulse">{progress}</p>}
          {error && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
        </div>

        {/* Suggestions */}
        <div className="bg-white/60 backdrop-blur rounded-2xl border border-slate-200/60 p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">💡 Try one of these</h3>
          <div className="grid gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="text-left p-3 rounded-xl text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
