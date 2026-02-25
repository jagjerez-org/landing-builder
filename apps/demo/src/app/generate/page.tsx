'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProviderOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  needsKey: boolean;
  needsUrl: boolean;
  defaultUrl: string;
  defaultModel: string;
  models: { id: string; label: string }[];
}

const providers: ProviderOption[] = [
  {
    id: 'openai', name: 'OpenAI', icon: '🤖', description: 'GPT-4o, GPT-4o-mini',
    needsKey: true, needsUrl: false, defaultUrl: 'https://api.openai.com/v1', defaultModel: 'gpt-4o-mini',
    models: [{ id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast)' }, { id: 'gpt-4o', label: 'GPT-4o (quality)' }, { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' }],
  },
  {
    id: 'anthropic', name: 'Anthropic', icon: '🧠', description: 'Claude Sonnet, Claude Haiku',
    needsKey: true, needsUrl: false, defaultUrl: 'https://api.anthropic.com/v1', defaultModel: 'claude-sonnet-4-20250514',
    models: [{ id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (recommended)' }, { id: 'claude-haiku-4-20250414', label: 'Claude Haiku 4 (fast)' }],
  },
  {
    id: 'openclaw', name: 'OpenClaw Agent', icon: '🔧', description: 'Connect to your self-hosted AI agent',
    needsKey: false, needsUrl: true, defaultUrl: 'http://localhost:18789', defaultModel: 'agent',
    models: [{ id: 'agent', label: 'Agent Default' }],
  },
  {
    id: 'ollama', name: 'Ollama', icon: '🦙', description: 'Run models locally — free, private',
    needsKey: false, needsUrl: true, defaultUrl: 'http://localhost:11434/v1', defaultModel: 'llama3.1',
    models: [{ id: 'llama3.1', label: 'Llama 3.1 8B' }, { id: 'llama3.1:70b', label: 'Llama 3.1 70B' }, { id: 'mistral', label: 'Mistral 7B' }, { id: 'codestral', label: 'Codestral' }],
  },
  {
    id: 'custom', name: 'Custom', icon: '🔌', description: 'Any OpenAI-compatible API',
    needsKey: true, needsUrl: true, defaultUrl: '', defaultModel: '',
    models: [],
  },
];

const locales = [
  { code: 'en', label: '🇺🇸 English' }, { code: 'es', label: '🇪🇸 Español' }, { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' }, { code: 'pt', label: '🇧🇷 Português' }, { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'ja', label: '🇯🇵 日本語' }, { code: 'zh', label: '🇨🇳 中文' }, { code: 'ko', label: '🇰🇷 한국어' },
  { code: 'ar', label: '🇸🇦 العربية' }, { code: 'nl', label: '🇳🇱 Nederlands' }, { code: 'ru', label: '🇷🇺 Русский' },
];

const suggestions = [
  'A modern SaaS platform for team collaboration with pricing tiers, customer testimonials, and an FAQ section',
  'An Italian restaurant in Madrid with a photo gallery, wine highlights, reservation form, and customer reviews',
  'A personal portfolio for a UX designer with projects, skills, client testimonials, and a contact form',
  'A yoga and wellness studio with class schedules, instructor profiles, membership pricing, and a free trial CTA',
  'A fintech startup that helps freelancers manage invoices — security features, pricing, trust badges, and stats',
  'An AI-powered code review tool for engineering teams with feature comparison, integrations list, and enterprise CTA',
];

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [locale, setLocale] = useState('en');
  const [providerId, setProviderId] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [showProviders, setShowProviders] = useState(false);

  const provider = providers.find((p) => p.id === providerId)!;

  // Load saved provider settings
  useEffect(() => {
    const saved = localStorage.getItem('lb-provider');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.id) setProviderId(s.id);
        if (s.key) setApiKey(s.key);
        if (s.url) setBaseUrl(s.url);
        if (s.model) setModel(s.model);
      } catch { /* ignore */ }
    }
  }, []);

  // Save provider settings
  useEffect(() => {
    localStorage.setItem('lb-provider', JSON.stringify({ id: providerId, key: apiKey, url: baseUrl, model }));
  }, [providerId, apiKey, baseUrl, model]);

  // Reset defaults when switching provider
  useEffect(() => {
    const p = providers.find((x) => x.id === providerId);
    if (p) {
      setBaseUrl(p.defaultUrl);
      setModel(p.defaultModel);
    }
  }, [providerId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (provider.needsKey && !apiKey.trim()) { setError('API key is required for ' + provider.name); return; }

    setLoading(true);
    setError('');
    setProgress(`Connecting to ${provider.name}...`);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt, locale, provider: providerId,
          apiKey: apiKey || undefined,
          baseUrl: baseUrl || undefined,
          model: model || undefined,
        }),
      });

      setProgress('AI is designing your page...');

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
        <a href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to home</a>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-2">
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Generate</span> your landing page
        </h1>
        <p className="text-lg text-slate-500 mb-8">Choose your AI provider, describe what you want, and let AI build it.</p>

        {/* Provider Selector */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-slate-700">AI Provider</label>
            <button onClick={() => setShowProviders(!showProviders)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              {showProviders ? 'Hide options' : 'Change provider'}
            </button>
          </div>

          {/* Active Provider Badge */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
            <span className="text-2xl">{provider.icon}</span>
            <div>
              <div className="font-semibold text-sm">{provider.name}</div>
              <div className="text-xs text-slate-500">{provider.description}</div>
            </div>
            {(apiKey || !provider.needsKey) && (
              <span className="ml-auto text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Connected</span>
            )}
          </div>

          {/* Provider Grid */}
          {showProviders && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setProviderId(p.id); setShowProviders(false); }}
                  className={`p-3 rounded-xl text-left text-sm transition-all ${providerId === p.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'}`}
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <div className="font-semibold text-xs">{p.name}</div>
                </button>
              ))}
            </div>
          )}

          {/* Provider Config */}
          <div className="space-y-3">
            {provider.needsKey && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${provider.name} API key`}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            {provider.needsUrl && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder={provider.defaultUrl || 'https://api.example.com/v1'}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            {provider.models.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {provider.models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Describe your landing page</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A modern fintech startup that helps freelancers manage invoices, with pricing plans, security features, customer testimonials, and a free trial CTA..."
            rows={5}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
          />

          <div className="flex items-center gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Language</label>
              <select value={locale} onChange={(e) => setLocale(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {locales.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            <div className="flex-1 flex justify-end pt-5">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`px-8 py-2.5 rounded-xl font-semibold text-white transition-all ${
                  loading ? 'bg-slate-400 cursor-wait' :
                  !prompt.trim() ? 'bg-slate-300 cursor-not-allowed' :
                  'bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Generating...
                  </span>
                ) : `🚀 Generate with ${provider.name}`}
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
              <button key={i} onClick={() => setPrompt(s)} className="text-left p-3 rounded-xl text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-200">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
