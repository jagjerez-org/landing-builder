import type { FC } from 'react';
import { BlockRegistry } from '@landing-builder/core';
import type { BlockDefinition } from '@landing-builder/core';
import { HeroBlock } from './hero';
import { FeaturesBlock } from './features';
import { CtaBlock } from './cta';
import { PricingBlock } from './pricing';
import { TestimonialsBlock } from './testimonials';
import { FaqBlock } from './faq';
import { FooterBlock } from './footer';
import { GalleryBlock } from './gallery';
import { StatsBlock } from './stats';
import { TeamBlock } from './team';
import { ContactBlock } from './contact';
import { SpacerBlock } from './spacer';
import { DividerBlock } from './divider';
import { EmbedBlock } from './embed';

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
