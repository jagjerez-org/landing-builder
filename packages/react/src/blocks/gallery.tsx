import type { FC } from 'react';
import React from 'react';
import type { GalleryProps, BlockDefinition } from '@landing-builder/core';

const colsClass = (n: number) => n === 4 ? 'grid-cols-dynamic-4' : n === 2 ? 'grid-cols-dynamic-2' : 'grid-cols-dynamic-3';

const Gallery: FC<GalleryProps> = ({ headline, images, columns = 3 }) => (
  <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16 animate-fade-in-up">{headline}</h2>
    <div className={`grid gap-6 ${colsClass(columns)}`}>
      {images.map((img, i) => (
        <figure key={i} className="group relative overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {img.caption && (
            <figcaption className="absolute bottom-0 left-0 right-0 p-6 text-white font-medium translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  </section>
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
