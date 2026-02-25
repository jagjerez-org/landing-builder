import type { FC } from 'react';
import React from 'react';
import type { DividerProps, BlockDefinition } from '@landing-builder/core';

const Divider: FC<DividerProps> = ({ color = '#e5e7eb', thickness = '1px', style = 'solid', maxWidth }) => (
  <hr style={{ border: 'none', borderTop: `${thickness} ${style} ${color}`, maxWidth: maxWidth ?? '100%', margin: '2rem auto' }} />
);

export const DividerBlock: BlockDefinition<FC<Record<string, unknown>>> = {
  type: 'divider', label: 'Divider', icon: '➖', category: 'custom',
  renderer: Divider as unknown as FC<Record<string, unknown>>,
  defaultProps: { color: '#e5e7eb', thickness: '1px', style: 'solid' },
};
