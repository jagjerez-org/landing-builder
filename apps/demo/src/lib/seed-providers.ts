/**
 * Seed provider configurations for local development.
 * Run: import { seedProviders } from '@/lib/seed-providers'; seedProviders();
 * 
 * This pre-configures providers so you can test immediately without manual setup.
 * Keys are loaded from server-side env vars via /api/providers/seed endpoint.
 */

export interface SeededProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  apiKey?: string;
  baseUrl: string;
  model: string;
  ready: boolean;
}

export function saveProviderConfig(config: {
  id: string;
  key?: string;
  url?: string;
  model?: string;
}) {
  localStorage.setItem('lb-provider', JSON.stringify(config));
}

export function getProviderConfig(): { id: string; key?: string; url?: string; model?: string } | null {
  const saved = localStorage.getItem('lb-provider');
  if (!saved) return null;
  try { return JSON.parse(saved); } catch { return null; }
}
