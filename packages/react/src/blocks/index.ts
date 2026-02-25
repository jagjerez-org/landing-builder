import type { FC } from 'react';
import { BlockRegistry } from '@landing-builder/core';
import type { BlockDefinition } from '@landing-builder/core';
import { HeroBlock } from './hero.js';
import { FeaturesBlock } from './features.js';
import { CtaBlock } from './cta.js';
import { PricingBlock } from './pricing.js';
import { TestimonialsBlock } from './testimonials.js';
import { FaqBlock } from './faq.js';
import { FooterBlock } from './footer.js';
import { GalleryBlock } from './gallery.js';
import { StatsBlock } from './stats.js';
import { TeamBlock } from './team.js';
import { ContactBlock } from './contact.js';
import { SpacerBlock } from './spacer.js';
import { DividerBlock } from './divider.js';
import { EmbedBlock } from './embed.js';

type ReactBlock = BlockDefinition<FC<Record<string, unknown>>>;

const registry = new BlockRegistry<FC<Record<string, unknown>>>();

const defaults: ReactBlock[] = [
  HeroBlock, FeaturesBlock, CtaBlock, PricingBlock,
  TestimonialsBlock, FaqBlock, FooterBlock, GalleryBlock,
  StatsBlock, TeamBlock, ContactBlock, SpacerBlock,
  DividerBlock, EmbedBlock,
];
defaults.forEach((b) => registry.register(b));

export function registerBlock(block: ReactBlock): void {
  registry.register(block);
}

export function getBlock(type: string) {
  return registry.get(type);
}

export function getAllBlocks() {
  return registry.getAll();
}

export const defaultBlocks = defaults;
