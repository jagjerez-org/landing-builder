'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { startAnthropicOAuth, startOpenAIOAuth, getProviderToken, clearProviderToken, type OAuthTokens } from '@/lib/oauth';

interface ProviderInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  hasKey?: boolean;
  maskedKey?: string;
  baseUrl: string;
  model: string;
  ready?: boolean;
  needsUserKey?: boolean;
  models: { id: string; label: string }[];
}

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
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [providerId, setProviderId] = useState('');
  const [model, setModel] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [seedLoading, setSeedLoading] = useState(true);
  const [oauthTokens, setOauthTokens] = useState<Record<string, OAuthTokens>>({});

  // Load OAuth tokens from localStorage
  useEffect(() => {
    const stored: Record<string, OAuthTokens> = {};
    for (const p of ['anthropic', 'openai']) {
      const t = getProviderToken(p);
      if (t) stored[p] = t;
    }
    setOauthTokens(stored);
  }, []);

  // Auto-detect available providers from server
  useEffect(() => {
    fetch('/api/providers/seed')
      .then((r) => r.json())
      .then((data) => {
        const p: ProviderInfo[] = data.providers || [];
        setProviders(p);
        // Auto-select first ready provider
        const ready = p.find((x) => x.hasKey || x.ready);
        if (ready) {
          setProviderId(ready.id);
          setModel(ready.model);
        } else if (p.length > 0) {
          setProviderId(p[0].id);
          setModel(p[0].model);
        }
        setSeedLoading(false);
      })
      .catch(() => setSeedLoading(false));
  }, []);

  const provider = providers.find((p) => p.id === providerId);
  const oauthToken = oauthTokens[providerId];
  const isReady = provider && (provider.hasKey || provider.ready === true || oauthToken || customKey || provider.id === 'custom');

  const handleOAuthLogin = useCallback(async (pid: string) => {
    if (pid === 'anthropic') {
      const url = await startAnthropicOAuth();
      // Anthropic uses a code-paste flow (no redirect back to us)
      // Open in new window, user copies the code
      window.open(url, '_blank', 'width=600,height=700');
      const code = window.prompt('After signing in, paste the authorization code here:');
      if (!code) return;

      const res = await fetch('/api/auth/anthropic/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.split('#')[0],
          state: code.split('#')[1],
          verifier: sessionStorage.getItem('anthropic_oauth_verifier'),
        }),
      });
      if (!res.ok) {
        setError(`Anthropic auth failed: ${await res.text()}`);
        return;
      }
      const tokens: OAuthTokens = await res.json();
      // Save
      const all = JSON.parse(localStorage.getItem('lb-oauth-tokens') || '{}');
      all.anthropic = tokens;
      localStorage.setItem('lb-oauth-tokens', JSON.stringify(all));
      setOauthTokens((prev) => ({ ...prev, anthropic: tokens }));
    } else if (pid === 'openai') {
      const callbackUrl = `${window.location.origin}/auth/callback/openai`;
      const url = await startOpenAIOAuth(callbackUrl);
      window.location.href = url;
    }
  }, []);

  const handleDisconnect = (pid: string) => {
    clearProviderToken(pid);
    setOauthTokens((prev) => {
      const next = { ...prev };
      delete next[pid];
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !provider) return;

    setLoading(true);
    setError('');
    setProgress(`Connecting to ${provider.name}...`);

    try {
      const body: Record<string, unknown> = {
        prompt, locale,
        provider: providerId === 'custom' ? 'openai' : providerId,
        model: model || provider.model,
      };

      // Send OAuth token if available
      if (oauthToken) {
        body.oauthToken = oauthToken.accessToken;
      } else if (provider.hasKey) {
        body.useServerKey = true;
      } else if (customKey) {
        body.apiKey = customKey;
      }

      if (providerId === 'custom' && customUrl) {
        body.baseUrl = customUrl;
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
        <p className="text-lg text-slate-500 mb-8">Sign in with your AI provider or paste a key.</p>

        {/* Provider Selector */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <label className="text-sm font-semibold text-slate-700 mb-4 block">AI Provider</label>

          {seedLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Detecting providers...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {providers.map((p) => {
                const active = providerId === p.id;
                const hasOAuth = !!oauthTokens[p.id];
                const available = p.hasKey || p.ready === true || hasOAuth || p.id === 'custom';
                return (
                  <button
                    key={p.id}
                    onClick={() => { setProviderId(p.id); setModel(p.model || ''); }}
                    className={`relative p-4 rounded-xl text-left transition-all ${
                      active ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' :
                      available ? 'bg-white border-2 border-slate-200 hover:border-blue-300 hover:shadow' :
                      'bg-white border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{p.icon}</div>
                    <div className="font-semibold text-sm text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-tight">{p.description}</div>
                    {/* Status badge */}
                    {(p.hasKey || hasOAuth || p.ready === true) && (
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-400 shadow shadow-green-200" title={hasOAuth ? 'Signed in via OAuth' : p.maskedKey ? `Key: ${p.maskedKey}` : 'Connected'} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Provider details */}
          {provider && (
            <div className="space-y-3 pt-2 border-t border-slate-100">

              {/* OAuth connected */}
              {oauthToken && (
                <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-green-700 flex items-center gap-2">
                    ✓ Signed in via OAuth
                  </span>
                  <button onClick={() => handleDisconnect(providerId)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Disconnect
                  </button>
                </div>
              )}

              {/* Server key */}
              {!oauthToken && provider.hasKey && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                  <span>✓</span> Server key: <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs">{provider.maskedKey}</code>
                </div>
              )}

              {/* OAuth sign-in buttons */}
              {!oauthToken && !provider.hasKey && (provider.id === 'openai' || provider.id === 'anthropic') && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleOAuthLogin(provider.id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                      provider.id === 'anthropic'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-orange-500/25'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/25'
                    }`}
                  >
                    {provider.icon} Sign in with {provider.id === 'anthropic' ? 'Claude' : 'ChatGPT'}
                  </button>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="flex-1 h-px bg-slate-200" />
                    or paste an API key
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder={provider.id === 'anthropic' ? 'sk-ant-api03-...' : 'sk-...'}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Custom provider */}
              {provider.id === 'custom' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Base URL</label>
                    <input type="text" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="https://api.example.com/v1" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">API Key</label>
                    <input type="password" value={customKey} onChange={(e) => setCustomKey(e.target.value)} placeholder="sk-..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}

              {/* Model selector */}
              {provider.models.length > 1 && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Model</label>
                  <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {provider.models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
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
                disabled={loading || !prompt.trim() || !isReady}
                className={`px-8 py-2.5 rounded-xl font-semibold text-white transition-all ${
                  loading ? 'bg-slate-400 cursor-wait' :
                  (!prompt.trim() || !isReady) ? 'bg-slate-300 cursor-not-allowed' :
                  'bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Generating...
                  </span>
                ) : `🚀 Generate with ${provider?.name || 'AI'}`}
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
