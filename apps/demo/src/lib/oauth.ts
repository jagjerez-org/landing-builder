/**
 * OAuth flows for Anthropic and OpenAI
 * Adapted from pi-ai's OAuth implementation
 */

// ---- PKCE ----
async function generatePKCE() {
  const verifierBytes = new Uint8Array(32);
  crypto.getRandomValues(verifierBytes);
  const verifier = btoa(String.fromCharCode(...verifierBytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return { verifier, challenge };
}

// ---- Anthropic OAuth ----
const ANTHROPIC_CLIENT_ID = atob('OWQxYzI1MGEtZTYxYi00NGQ5LTg4ZWQtNTk0NGQxOTYyZjVl');
const ANTHROPIC_AUTHORIZE_URL = 'https://claude.ai/oauth/authorize';
const ANTHROPIC_TOKEN_URL = 'https://console.anthropic.com/v1/oauth/token';
const ANTHROPIC_REDIRECT_URI = 'https://console.anthropic.com/oauth/code/callback';
const ANTHROPIC_SCOPES = 'org:create_api_key user:profile user:inference';

export async function startAnthropicOAuth() {
  const { verifier, challenge } = await generatePKCE();

  const params = new URLSearchParams({
    code: 'true',
    client_id: ANTHROPIC_CLIENT_ID,
    response_type: 'code',
    redirect_uri: ANTHROPIC_REDIRECT_URI,
    scope: ANTHROPIC_SCOPES,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state: verifier,
  });

  const authUrl = `${ANTHROPIC_AUTHORIZE_URL}?${params.toString()}`;

  // Store verifier for the callback
  sessionStorage.setItem('anthropic_oauth_verifier', verifier);

  return authUrl;
}

export async function exchangeAnthropicCode(authCode: string): Promise<OAuthTokens> {
  // authCode format: "code#state"
  const [code, state] = authCode.split('#');
  const verifier = sessionStorage.getItem('anthropic_oauth_verifier') || state;

  const res = await fetch('/api/auth/anthropic/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state, verifier }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  return res.json();
}

// ---- OpenAI OAuth ----
const OPENAI_CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann';
const OPENAI_AUTHORIZE_URL = 'https://auth.openai.com/oauth/authorize';
const OPENAI_SCOPE = 'openid profile email offline_access';

export async function startOpenAIOAuth(callbackUrl: string) {
  const { verifier, challenge } = await generatePKCE();
  const state = crypto.randomUUID();

  const url = new URL(OPENAI_AUTHORIZE_URL);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', OPENAI_CLIENT_ID);
  url.searchParams.set('redirect_uri', callbackUrl);
  url.searchParams.set('scope', OPENAI_SCOPE);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state', state);
  url.searchParams.set('id_token_add_organizations', 'true');
  url.searchParams.set('codex_cli_simplified_flow', 'true');
  url.searchParams.set('originator', 'landing-builder');

  // Store for callback
  sessionStorage.setItem('openai_oauth_verifier', verifier);
  sessionStorage.setItem('openai_oauth_state', state);

  return url.toString();
}

export async function exchangeOpenAICode(code: string, state: string, callbackUrl: string): Promise<OAuthTokens> {
  const verifier = sessionStorage.getItem('openai_oauth_verifier');
  const savedState = sessionStorage.getItem('openai_oauth_state');

  if (savedState && state !== savedState) {
    throw new Error('State mismatch');
  }

  const res = await fetch('/api/auth/openai/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, verifier, redirectUri: callbackUrl }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  return res.json();
}

// ---- Types ----
export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  provider: 'anthropic' | 'openai';
  accountId?: string;
}

// ---- Token storage (localStorage) ----
const STORAGE_KEY = 'lb-oauth-tokens';

export function saveTokens(provider: string, tokens: OAuthTokens) {
  const all = getStoredTokens();
  all[provider] = tokens;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getStoredTokens(): Record<string, OAuthTokens> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getProviderToken(provider: string): OAuthTokens | null {
  const all = getStoredTokens();
  const token = all[provider];
  if (!token) return null;
  // Check expiry (with 5min buffer)
  if (token.expiresAt && Date.now() > token.expiresAt - 5 * 60 * 1000) {
    return null; // Expired — need refresh
  }
  return token;
}

export function clearProviderToken(provider: string) {
  const all = getStoredTokens();
  delete all[provider];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
