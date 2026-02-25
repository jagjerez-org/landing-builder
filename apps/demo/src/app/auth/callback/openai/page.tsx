'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OpenAICallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState('Completing sign in...');

  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');

    if (!code) {
      setStatus('Missing authorization code');
      return;
    }

    const callbackUrl = `${window.location.origin}/auth/callback/openai`;
    const verifier = sessionStorage.getItem('openai_oauth_verifier');

    fetch('/api/auth/openai/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, verifier, redirectUri: callbackUrl }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((tokens) => {
        // Save tokens
        const all = JSON.parse(localStorage.getItem('lb-oauth-tokens') || '{}');
        all.openai = { ...tokens, provider: 'openai' };
        localStorage.setItem('lb-oauth-tokens', JSON.stringify(all));

        setStatus('Connected! Redirecting...');
        sessionStorage.removeItem('openai_oauth_verifier');
        sessionStorage.removeItem('openai_oauth_state');
        router.push('/generate');
      })
      .catch((err) => {
        setStatus(`Error: ${err.message}`);
      });
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <div className="text-4xl mb-4">🤖</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">OpenAI</h2>
        <p className="text-slate-500">{status}</p>
      </div>
    </div>
  );
}

export default function OpenAICallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <OpenAICallbackInner />
    </Suspense>
  );
}
