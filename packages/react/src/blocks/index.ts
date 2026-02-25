import type { FC } from 'react';
import { BlockRegistry } from '@landing-builder/core';
import type { BlockDefinition } from '@landing-builder/core';
import { HeroBlock } from './hero.js';
import { FeaturesBlock } from './features.js';
import { CtaBlock } from './cta.js';

type ReactBlock = BlockDefinition<FC<Record<string, unknown>>>;

const registry = new BlockRegistry<FC<Record<string, unknown>>>();

// Register default blocks
const defaults: ReactBlock[] = [HeroBlock, FeaturesBlock, CtaBlock];
defaults.forEach((b) => registry.register(b));

export function registerBlock(block: ReactBlock): void {
  registry.register(block);
}

export function getBlock(type: string) {
  return registry.get(type);
}

export const defaultBlocks = defaults;
