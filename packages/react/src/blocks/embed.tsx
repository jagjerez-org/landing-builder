import type { FC } from 'react';
import React from 'react';
import type { EmbedProps, BlockDefinition } from '@landing-builder/core';

const ratioMap: Record<string, string> = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%', auto: '56.25%' };

const Embed: FC<EmbedProps> = ({ url, aspectRatio = '16:9', maxWidth }) => (
  <div style={{ padding: '2rem', maxWidth: maxWidth ?? 900, margin: '0 auto' }}>
    <div style={{ position: 'relative', paddingBottom: ratioMap[aspectRatio], height: 0, overflow: 'hidden', borderRadius: 8 }}>
      <iframe src={url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen loading="lazy" />
    </div>
  </div>
);

export const EmbedBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'embed', label: 'Embed', icon: '🔗', category: 'custom',
  renderer: Embed as unknown as FC<Record<string, unknown>>,
  defaultProps: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', type: 'video', aspectRatio: '16:9' },
};
