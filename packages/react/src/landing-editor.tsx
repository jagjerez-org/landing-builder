/**
 * LandingEditor — full visual editor with drag-and-drop, block catalog, and props panel.
 */

import type { FC } from 'react';
import React, { useState, useCallback } from 'react';
import type { LandingPage, Section, SectionType } from '@landing-builder/core';
import { renderToHtml } from '@landing-builder/core';
import type { PageStateActions } from './use-page-state';
import { LandingRenderer } from './landing-renderer';
import { getAllBlocks, getBlock } from './blocks/index';

export interface LandingEditorProps {
  page: LandingPage;
  actions: PageStateActions;
  className?: string;
  /** Called when user clicks "Export HTML" */
  onExportHtml?: (html: string) => void;
  /** Called when user clicks "Export JSON" */
  onExportJson?: (json: LandingPage) => void;
}

export const LandingEditor: FC<LandingEditorProps> = ({ page, actions, className, onExportHtml, onExportJson }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const sorted = [...page.sections].sort((a, b) => a.order - b.order);
  const selected = sorted.find((s) => s.id === selectedId);
  const selectedBlock = selected ? getBlock(selected.type) : undefined;

  const addBlock = useCallback((type: SectionType) => {
    const block = getBlock(type);
    if (!block) return;
    const id = `${type}-${Date.now()}`;
    actions.addSection({ id, type, visible: true, props: { ...block.defaultProps } });
    setSelectedId(id);
    setShowCatalog(false);
  }, [actions]);

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = (idx: number) => {
    if (draggedIdx !== null && draggedIdx !== idx) {
      actions.moveSection(sorted[draggedIdx].id, idx);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  if (previewMode) {
    return (
      <div className={className}>
        <div style={{ padding: '0.5rem 1rem', background: '#111', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Preview Mode</span>
          <button onClick={() => setPreviewMode(false)} style={toolbarBtn}>← Back to Editor</button>
        </div>
        <LandingRenderer page={page} useComponents={true} />
      </div>
    );
  }

  return (
    <div className={className} style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem' }}>
      {/* ── LEFT: Section List ── */}
      <aside style={{ width: 240, background: '#f9fafb', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>
          Sections
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
          {sorted.map((section, idx) => {
            const block = getBlock(section.type);
            return (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
                onClick={() => setSelectedId(section.id)}
                style={{
                  padding: '0.5rem 0.75rem', marginBottom: 4, borderRadius: 6, cursor: 'grab',
                  background: selectedId === section.id ? '#dbeafe' : dragOverIdx === idx ? '#f3f4f6' : 'white',
                  border: selectedId === section.id ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                  opacity: section.visible ? 1 : 0.4,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <span>{block?.icon} {block?.label ?? section.type}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  <button onClick={(e) => { e.stopPropagation(); actions.toggleSection(section.id); }} style={iconBtn} title="Toggle">{section.visible ? '👁' : '👁‍🗨'}</button>
                  <button onClick={(e) => { e.stopPropagation(); actions.duplicateSection(section.id); }} style={iconBtn} title="Duplicate">📋</button>
                  <button onClick={(e) => { e.stopPropagation(); actions.removeSection(section.id); if (selectedId === section.id) setSelectedId(null); }} style={iconBtn} title="Delete">🗑</button>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => setShowCatalog(!showCatalog)} style={{ margin: '0.5rem', padding: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          + Add Block
        </button>
      </aside>

      {/* ── CENTER: Canvas ── */}
      <main style={{ flex: 1, overflow: 'auto', background: '#f3f4f6', position: 'relative' }}>
        {/* Toolbar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, padding: '0.5rem 1rem', background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={actions.undo} disabled={!actions.canUndo} style={toolbarBtn}>↩ Undo</button>
          <button onClick={actions.redo} disabled={!actions.canRedo} style={toolbarBtn}>↪ Redo</button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setPreviewMode(true)} style={toolbarBtn}>👁 Preview</button>
          {onExportJson && <button onClick={() => onExportJson(page)} style={toolbarBtn}>📦 JSON</button>}
          {onExportHtml && <button onClick={() => onExportHtml(renderToHtml(page, { fullDocument: true }))} style={toolbarBtn}>🌐 HTML</button>}
        </div>

        {/* Block Catalog (overlay) */}
        {showCatalog && (
          <div style={{ position: 'absolute', top: 48, left: 0, right: 0, zIndex: 20, background: 'white', borderBottom: '2px solid #3b82f6', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
            {getAllBlocks().map((block) => (
              <button key={block.type} onClick={() => addBlock(block.type as SectionType)} style={{ padding: '1rem 0.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', textAlign: 'center', fontSize: '0.8rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{block.icon}</div>
                {block.label}
              </button>
            ))}
          </div>
        )}

        {/* Page canvas */}
        <div style={{ maxWidth: 960, margin: '1rem auto', background: 'white', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minHeight: '80vh' }}>
          {sorted.filter((s) => s.visible).map((section) => (
            <div
              key={section.id}
              onClick={() => setSelectedId(section.id)}
              style={{ position: 'relative', cursor: 'pointer', outline: selectedId === section.id ? '2px solid #3b82f6' : '2px solid transparent', outlineOffset: -2, borderRadius: 4, transition: 'outline 0.15s' }}
            >
              <SectionRender section={section} />
              {selectedId === section.id && (
                <div style={{ position: 'absolute', top: 4, right: 4, background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600 }}>
                  {getBlock(section.type)?.label ?? section.type}
                </div>
              )}
            </div>
          ))}
          {sorted.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.4 }}>
              <p style={{ fontSize: '1.25rem' }}>No sections yet</p>
              <p>Click "+ Add Block" to get started</p>
            </div>
          )}
        </div>
      </main>

      {/* ── RIGHT: Props Panel ── */}
      <aside style={{ width: 300, background: '#f9fafb', borderLeft: '1px solid #e5e7eb', overflow: 'auto' }}>
        <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>
          Properties
        </div>
        {selected ? (
          <div style={{ padding: '0.75rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              {selectedBlock?.icon} {selectedBlock?.label ?? selected.type}
            </div>
            <PropsEditor
              props={selected.props}
              onChange={(newProps) => actions.updateSectionProps(selected.id, newProps)}
            />
            {/* Style section */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>STYLE</div>
              <label style={labelStyle}>Background Color
                <input type="color" value={selected.style?.backgroundColor ?? '#ffffff'} onChange={(e) => actions.updateSectionStyle(selected.id, { backgroundColor: e.target.value })} style={{ width: '100%', height: 32 }} />
              </label>
              <label style={labelStyle}>Padding
                <input type="text" value={selected.style?.padding ?? ''} placeholder="e.g. 4rem 2rem" onChange={(e) => actions.updateSectionStyle(selected.id, { padding: e.target.value })} style={inputStyle} />
              </label>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.4 }}>
            <p>Select a section to edit its properties</p>
          </div>
        )}
      </aside>
    </div>
  );
};

// ─── Props Editor (auto-generates form from props) ──────

const PropsEditor: FC<{ props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }> = ({ props, onChange }) => {
  const update = (key: string, value: unknown) => onChange({ [key]: value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {Object.entries(props).map(([key, value]) => {
        if (Array.isArray(value)) {
          return <ArrayField key={key} label={key} items={value} onChange={(v) => update(key, v)} />;
        }
        if (typeof value === 'object' && value !== null) {
          return null; // Skip nested objects for now
        }
        if (typeof value === 'boolean') {
          return (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={value} onChange={(e) => update(key, e.target.checked)} />
              <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{humanize(key)}</span>
            </label>
          );
        }
        if (typeof value === 'number') {
          return (
            <label key={key} style={labelStyle}>
              {humanize(key)}
              <input type="number" value={value} onChange={(e) => update(key, Number(e.target.value))} style={inputStyle} />
            </label>
          );
        }
        // Default: string
        const strVal = String(value ?? '');
        const isLong = strVal.length > 60;
        return (
          <label key={key} style={labelStyle}>
            {humanize(key)}
            {isLong ? (
              <textarea value={strVal} onChange={(e) => update(key, e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            ) : (
              <input type="text" value={strVal} onChange={(e) => update(key, e.target.value)} style={inputStyle} />
            )}
          </label>
        );
      })}
    </div>
  );
};

// ─── Array Field ────────────────────────────────────────

const ArrayField: FC<{ label: string; items: unknown[]; onChange: (items: unknown[]) => void }> = ({ label, items, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.5rem' }}>
      <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
        {humanize(label)} ({items.length})
        <span>{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: 4, position: 'relative' }}>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: 4 }}>#{i + 1}</div>
              {typeof item === 'object' && item !== null ? (
                Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  typeof v === 'string' || typeof v === 'number' ? (
                    <label key={k} style={{ ...labelStyle, marginBottom: 4 }}>
                      {humanize(k)}
                      <input type={typeof v === 'number' ? 'number' : 'text'} value={String(v)} onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...(item as Record<string, unknown>), [k]: typeof v === 'number' ? Number(e.target.value) : e.target.value };
                        onChange(updated);
                      }} style={inputStyle} />
                    </label>
                  ) : null
                ))
              ) : (
                <input type="text" value={String(item)} onChange={(e) => { const u = [...items]; u[i] = e.target.value; onChange(u); }} style={inputStyle} />
              )}
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 4, right: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', color: '#ef4444' }}>✕</button>
            </div>
          ))}
          <button onClick={() => {
            const template = items.length > 0 && typeof items[0] === 'object' ? Object.fromEntries(Object.keys(items[0] as Record<string, unknown>).map((k) => [k, ''])) : '';
            onChange([...items, template]);
          }} style={{ padding: '0.25rem', background: '#e5e7eb', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}>
            + Add item
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Section Renderer wrapper ───────────────────────────

const SectionRender: FC<{ section: Section }> = ({ section }) => {
  const block = getBlock(section.type);
  if (!block) return <div style={{ padding: '2rem', background: '#fef3c7' }}>Unknown: {section.type}</div>;
  const Component = block.renderer as FC<Record<string, unknown>>;
  return <Component {...section.props} />;
};

// ─── Helpers ────────────────────────────────────────────

function humanize(s: string): string {
  return s.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).replace(/([a-z])([A-Z])/g, '$1 $2');
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #d1d5db', borderRadius: 4, fontSize: '0.8rem', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2, fontSize: '0.8rem', fontWeight: 500 };
const iconBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px' };
const toolbarBtn: React.CSSProperties = { padding: '0.35rem 0.75rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 };
