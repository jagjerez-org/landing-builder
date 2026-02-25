import type { FC } from 'react';
import React from 'react';
import type { GalleryProps, BlockDefinition } from '@landing-builder/core';

const Gallery: FC<GalleryProps> = ({ headline, images, columns = 3 }) => (
  <div className="px-6 py-20 md:py-28 max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">{headline}</h2>
    <div className={`grid gap-6 md:grid-cols-${columns}`}>
      {images.map((img, i) => (
        <figure key={i} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <img src={img.src} alt={img.alt} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          {img.caption && (
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  </div>
);

export const GalleryBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'gallery', label: 'Gallery', icon: '🖼️', category: 'content',
  renderer: Gallery as unknown as FC<Record<string, unknown>>,
  defaultProps: { headline: 'Gallery', columns: 3, layout: 'grid', images: [
    { src: 'https://placehold.co/800x600/3b82f6/white?text=Project+One', alt: 'Project 1', caption: 'Award-winning design' },
    { src: 'https://placehold.co/800x600/8b5cf6/white?text=Project+Two', alt: 'Project 2', caption: 'Mobile experience' },
    { src: 'https://placehold.co/800x600/ec4899/white?text=Project+Three', alt: 'Project 3', caption: 'Brand identity' },
  ]},
};
