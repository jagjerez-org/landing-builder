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
  onExportHtml?: (html: string) => void;
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
    if (draggedIdx !== null && draggedIdx !== idx) actions.moveSection(sorted[draggedIdx].id, idx);
    setDraggedIdx(null); setDragOverIdx(null);
  };

  if (previewMode) {
    return (
      <div className={className}>
        <div className="px-4 py-3 bg-gray-900 text-white flex items-center justify-between">
          <span className="font-semibold text-sm">Preview Mode</span>
          <button onClick={() => setPreviewMode(false)} className="px-4 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors">← Back to Editor</button>
        </div>
        <LandingRenderer page={page} useComponents={true} />
      </div>
    );
  }

  return (
    <div className={`${className ?? ''} flex h-screen font-[system-ui] text-sm`}>
      {/* ── LEFT: Section List ── */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] font-bold">LB</div>
          <span className="font-bold text-xs uppercase tracking-wider text-gray-400">Sections</span>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-grab transition-all duration-150 ${
                  selectedId === section.id ? 'bg-blue-600/30 ring-1 ring-blue-500/50' :
                  dragOverIdx === idx ? 'bg-white/10' : 'hover:bg-white/5'
                } ${section.visible ? 'opacity-100' : 'opacity-40'}`}
              >
                <span className="truncate flex items-center gap-2">
                  <span>{block?.icon}</span>
                  <span className="text-gray-300">{block?.label ?? section.type}</span>
                </span>
                <div className="flex gap-0.5">
                  <button onClick={(e) => { e.stopPropagation(); actions.toggleSection(section.id); }} className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors" title="Toggle">{section.visible ? '👁' : '👁‍🗨'}</button>
                  <button onClick={(e) => { e.stopPropagation(); actions.duplicateSection(section.id); }} className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors" title="Duplicate">📋</button>
                  <button onClick={(e) => { e.stopPropagation(); actions.removeSection(section.id); if (selectedId === section.id) setSelectedId(null); }} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors" title="Delete">🗑</button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setShowCatalog(!showCatalog)}
          className="m-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
        >
          + Add Block
        </button>
      </aside>

      {/* ── CENTER: Canvas ── */}
      <main className="flex-1 overflow-auto bg-gray-100 relative">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 px-4 py-2.5 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button onClick={actions.undo} disabled={!actions.canUndo} className="px-3 py-1.5 rounded-md text-xs font-medium hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↩ Undo</button>
            <button onClick={actions.redo} disabled={!actions.canRedo} className="px-3 py-1.5 rounded-md text-xs font-medium hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↪ Redo</button>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button onClick={() => setPreviewMode(true)} className="px-3 py-1.5 rounded-md text-xs font-medium hover:bg-white transition-colors">👁 Preview</button>
            {onExportJson && <button onClick={() => onExportJson(page)} className="px-3 py-1.5 rounded-md text-xs font-medium hover:bg-white transition-colors">📦 JSON</button>}
            {onExportHtml && <button onClick={() => onExportHtml(renderToHtml(page, { fullDocument: true }))} className="px-3 py-1.5 rounded-md text-xs font-medium hover:bg-white transition-colors">🌐 HTML</button>}
          </div>
        </div>

        {/* Block Catalog */}
        {showCatalog && (
          <div className="absolute top-12 left-0 right-0 z-20 bg-white border-b-2 border-blue-500 p-4 shadow-xl">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
              {getAllBlocks().map((block) => (
                <button key={block.type} onClick={() => addBlock(block.type as SectionType)} className="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl cursor-pointer text-center transition-all duration-200 hover:-translate-y-0.5">
                  <div className="text-2xl mb-2">{block.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{block.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page canvas */}
        <div className="max-w-[960px] mx-auto my-6 bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 min-h-[80vh] overflow-hidden">
          {sorted.filter((s) => s.visible).map((section) => (
            <div
              key={section.id}
              onClick={() => setSelectedId(section.id)}
              className={`relative cursor-pointer transition-all duration-150 ${
                selectedId === section.id ? 'ring-2 ring-blue-500 ring-inset rounded-lg' : 'hover:ring-2 hover:ring-blue-200 hover:ring-inset rounded-lg'
              }`}
            >
              <SectionRender section={section} />
              {selectedId === section.id && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                  {getBlock(section.type)?.label ?? section.type}
                </div>
              )}
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-gray-300">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg font-medium">No sections yet</p>
              <p className="text-sm">Click &quot;+ Add Block&quot; to get started</p>
            </div>
          )}
        </div>
      </main>

      {/* ── RIGHT: Props Panel ── */}
      <aside className="w-[300px] bg-white border-l border-gray-200 overflow-auto">
        <div className="px-4 py-3 border-b border-gray-200">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-400">Properties</span>
        </div>
        {selected ? (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <span className="text-xl">{selectedBlock?.icon}</span>
              <span className="font-bold text-gray-900">{selectedBlock?.label ?? selected.type}</span>
            </div>
            <PropsEditor props={selected.props} onChange={(newProps) => actions.updateSectionProps(selected.id, newProps)} />
            {/* Style section */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Style</div>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 mb-4">
                Background Color
                <div className="flex gap-2 items-center">
                  <input type="color" value={selected.style?.backgroundColor ?? '#ffffff'} onChange={(e) => actions.updateSectionStyle(selected.id, { backgroundColor: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <input type="text" value={selected.style?.backgroundColor ?? '#ffffff'} onChange={(e) => actions.updateSectionStyle(selected.id, { backgroundColor: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono" />
                </div>
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                Padding
                <input type="text" value={selected.style?.padding ?? ''} placeholder="e.g. 4rem 2rem" onChange={(e) => actions.updateSectionStyle(selected.id, { padding: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-xl text-sm" />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <div className="text-4xl mb-3">👈</div>
            <p className="text-sm font-medium">Select a section to edit</p>
          </div>
        )}
      </aside>
    </div>
  );
};

// ─── Props Editor ───────────────────────────────────────

const PropsEditor: FC<{ props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }> = ({ props, onChange }) => {
  const update = (key: string, value: unknown) => onChange({ [key]: value });

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(props).map(([key, value]) => {
        if (Array.isArray(value)) {
          return <ArrayField key={key} label={key} items={value} onChange={(v) => update(key, v)} />;
        }
        if (typeof value === 'object' && value !== null) return null;
        if (typeof value === 'boolean') {
          return (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={value} onChange={(e) => update(key, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{humanize(key)}</span>
            </label>
          );
        }
        if (typeof value === 'number') {
          return (
            <label key={key} className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">{humanize(key)}</span>
              <input type="number" value={value} onChange={(e) => update(key, Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </label>
          );
        }
        const strVal = String(value ?? '');
        const isLong = strVal.length > 60;
        return (
          <label key={key} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">{humanize(key)}</span>
            {isLong ? (
              <textarea value={strVal} onChange={(e) => update(key, e.target.value)} rows={3} className="px-3 py-2 border border-gray-200 rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            ) : (
              <input type="text" value={strVal} onChange={(e) => update(key, e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        <span>{humanize(label)} <span className="text-gray-400 font-normal">({items.length})</span></span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="relative p-3 bg-gray-50 rounded-xl">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">#{i + 1}</div>
              {typeof item === 'object' && item !== null ? (
                <div className="space-y-2">
                  {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                    typeof v === 'string' || typeof v === 'number' ? (
                      <label key={k} className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500">{humanize(k)}</span>
                        <input type={typeof v === 'number' ? 'number' : 'text'} value={String(v)} onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...(item as Record<string, unknown>), [k]: typeof v === 'number' ? Number(e.target.value) : e.target.value };
                          onChange(updated);
                        }} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </label>
                    ) : null
                  ))}
                </div>
              ) : (
                <input type="text" value={String(item)} onChange={(e) => { const u = [...items]; u[i] = e.target.value; onChange(u); }} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs" />
              )}
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-md hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
            </div>
          ))}
          <button onClick={() => {
            const template = items.length > 0 && typeof items[0] === 'object' ? Object.fromEntries(Object.keys(items[0] as Record<string, unknown>).map((k) => [k, ''])) : '';
            onChange([...items, template]);
          }} className="w-full py-2 text-xs font-medium text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-lg transition-colors">
            + Add item
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Section Renderer ───────────────────────────────────

const SectionRender: FC<{ section: Section }> = ({ section }) => {
  const block = getBlock(section.type);
  if (!block) return <div className="p-8 bg-amber-50 text-amber-800 text-sm">Unknown block: {section.type}</div>;
  const Component = block.renderer as FC<Record<string, unknown>>;
  return <Component {...section.props} />;
};

// ─── Helpers ────────────────────────────────────────────

function humanize(s: string): string {
  return s.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).replace(/([a-z])([A-Z])/g, '$1 $2');
}
