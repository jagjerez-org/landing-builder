'use client';

import { useEffect, useState } from 'react';
import type { LandingPage } from '@landing-builder/core';
import { renderToHtml } from '@landing-builder/core';
import { LandingEditor, usePageState } from '@landing-builder/react';
import { samplePages } from '@/lib/sample-pages';

const emptyPage: LandingPage = {
  id: 'new-page', name: 'My Landing Page', slug: 'my-page',
  meta: { title: 'My Landing Page', description: '' },
  theme: { preset: 'default', colors: { primary: '#3b82f6', secondary: '#8b5cf6', background: '#ffffff', text: '#111827', accent: '#f59e0b' }, fonts: { heading: 'system-ui', body: 'system-ui' }, borderRadius: 'md', spacing: 'normal' },
  sections: [],
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

export default function EditorPage() {
  const [initial, setInitial] = useState<LandingPage | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lb-current-page');
    if (stored) {
      try { setInitial(JSON.parse(stored)); return; } catch { /* ignore */ }
    }
    setInitial(emptyPage);
  }, []);

  if (!initial) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

  return <EditorInner initial={initial} />;
}

function EditorInner({ initial }: { initial: LandingPage }) {
  const [page, actions] = usePageState(initial, (updated) => {
    localStorage.setItem('lb-current-page', JSON.stringify(updated));
  });

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <LandingEditor
      page={page}
      actions={actions}
      onExportHtml={(html) => downloadFile(html, `${page.slug}.html`, 'text/html')}
      onExportJson={(json) => downloadFile(JSON.stringify(json, null, 2), `${page.slug}.json`, 'application/json')}
    />
  );
}
