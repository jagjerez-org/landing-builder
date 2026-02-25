import type { FC } from 'react';
import React from 'react';
import type { SpacerProps, BlockDefinition } from '@landing-builder/core';

const Spacer: FC<SpacerProps> = ({ height = '4rem' }) => <div style={{ height }} />;

export const SpacerBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'spacer', label: 'Spacer', icon: '↕️', category: 'custom',
  renderer: Spacer as unknown as FC<Record<string, unknown>>,
  defaultProps: { height: '4rem' },
};
