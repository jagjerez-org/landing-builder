import { NextResponse } from 'next/server';

const CLIENT_ID = Buffer.from('OWQxYzI1MGEtZTYxYi00NGQ5LTg4ZWQtNTk0NGQxOTYyZjVl', 'base64').toString();
const TOKEN_URL = 'https://console.anthropic.com/v1/oauth/token';
const REDIRECT_URI = 'https://console.anthropic.com/oauth/code/callback';

export async function POST(req: Request) {
  try {
    const { code, state, verifier } = await req.json();

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code,
        state,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Token exchange failed: ${text}` }, { status: res.status });
    }

    const data = await res.json();
    const expiresAt = Date.now() + data.expires_in * 1000 - 5 * 60 * 1000;

    return NextResponse.json({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      provider: 'anthropic',
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
