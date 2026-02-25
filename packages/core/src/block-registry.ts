/**
 * Block Registry — register and retrieve section renderers.
 * Framework-agnostic: renderers are opaque values (React components, Vue components, etc.)
 */

import type { SectionType } from './schema';

export class BlockRegistry<TRenderer = unknown> {
  private blocks = new Map<string, BlockDefinition<TRenderer>>();

  register(definition: BlockDefinition<TRenderer>): void {
    this.blocks.set(definition.type, definition);
  }

  get(type: string): BlockDefinition<TRenderer> | undefined {
    return this.blocks.get(type);
  }

  getAll(): BlockDefinition<TRenderer>[] {
    return Array.from(this.blocks.values());
  }

  has(type: string): boolean {
    return this.blocks.has(type);
  }

  types(): string[] {
    return Array.from(this.blocks.keys());
  }
}

export interface BlockDefinition<TRenderer = unknown> {
  /** Section type identifier */
  type: SectionType | string;

  /** Display name for the editor */
  label: string;

  /** Icon identifier (lucide name, emoji, or URL) */
  icon: string;

  /** Category for grouping in the editor sidebar */
  category: 'content' | 'social-proof' | 'conversion' | 'navigation' | 'custom';

  /** The framework-specific renderer */
  renderer: TRenderer;

  /** Default props when adding a new instance */
  defaultProps: Record<string, unknown>;

  /** JSON schema or Zod-like descriptor for the editor panel */
  propsSchema?: Record<string, PropField>;
}

export interface PropField {
  type: 'text' | 'textarea' | 'number' | 'select' | 'color' | 'image' | 'url' | 'boolean' | 'array' | 'object';
  label: string;
  required?: boolean;
  default?: unknown;
  options?: { label: string; value: string }[];
  items?: Record<string, PropField>;
}
