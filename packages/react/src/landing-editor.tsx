/**
 * LandingEditor — drag-and-drop visual editor (placeholder).
 * Full implementation will use @dnd-kit or similar.
 */

import type { FC } from 'react';
import React from 'react';
import type { LandingPage } from '@landing-builder/core';
import type { PageStateActions } from './use-page-state.js';
import { LandingRenderer } from './landing-renderer.js';

export interface LandingEditorProps {
  page: LandingPage;
  actions: PageStateActions;
  className?: string;
}

export const LandingEditor: FC<LandingEditorProps> = ({ page, actions, className }) => {
  return (
    <div className={className} style={{ display: 'flex', gap: '1rem' }}>
      {/* Sidebar */}
      <aside style={{ width: 280, flexShrink: 0, borderRight: '1px solid #e5e7eb', padding: '1rem' }}>
        <h3>Sections</h3>
        {page.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} style={{ padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: section.visible ? 1 : 0.5 }}>
              <span>{section.type}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => actions.toggleSection(section.id)} title="Toggle visibility">
                  {section.visible ? '👁' : '👁‍🗨'}
                </button>
                <button onClick={() => actions.duplicateSection(section.id)} title="Duplicate">📋</button>
                <button onClick={() => actions.removeSection(section.id)} title="Remove">🗑</button>
              </div>
            </div>
          ))}
        <div style={{ marginTop: '1rem', display: 'flex', gap: 4 }}>
          <button onClick={actions.undo} disabled={!actions.canUndo}>↩ Undo</button>
          <button onClick={actions.redo} disabled={!actions.canRedo}>↪ Redo</button>
        </div>
      </aside>

      {/* Canvas */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <LandingRenderer page={page} useComponents={true} />
      </main>
    </div>
  );
};
