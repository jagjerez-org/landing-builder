import type { FC } from 'react';
import React from 'react';
import type { GalleryProps, BlockDefinition } from '@landing-builder/core';

const Gallery: FC<GalleryProps> = ({ headline, images, columns = 3 }) => (
  <div style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>{headline}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1rem' }}>
      {images.map((img, i) => (
        <figure key={i} style={{ margin: 0, borderRadius: 8, overflow: 'hidden' }}>
          <img src={img.src} alt={img.alt} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} loading="lazy" />
          {img.caption && <figcaption style={{ padding: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>{img.caption}</figcaption>}
        </figure>
      ))}
    </div>
  </div>
);

export const GalleryBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'gallery', label: 'Gallery', icon: '🖼️', category: 'content',
  renderer: Gallery as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Gallery', columns: 3, layout: 'grid', images: [
    { src: 'https://placehold.co/600x400/3b82f6/white?text=Image+1', alt: 'Image 1' },
    { src: 'https://placehold.co/600x400/8b5cf6/white?text=Image+2', alt: 'Image 2' },
    { src: 'https://placehold.co/600x400/ec4899/white?text=Image+3', alt: 'Image 3' },
  ]},
};
