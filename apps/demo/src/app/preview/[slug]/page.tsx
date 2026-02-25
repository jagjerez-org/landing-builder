'use client';

import { useEffect, useState } from 'react';
import type { LandingPage } from '@landing-builder/core';
import { LandingRenderer } from '@landing-builder/react';

export default function PreviewPage() {
  const [page, setPage] = useState<LandingPage | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lb-current-page');
    if (stored) {
      try { setPage(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  if (!page) return <div style={{ padding: '4rem', textAlign: 'center' }}>No page found. Generate or pick one from the gallery first.</div>;

  return <LandingRenderer page={page} useComponents={true} />;
}
