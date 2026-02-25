/**
 * React hook for managing LandingPage state with undo/redo.
 */

import { useState, useCallback, useRef } from 'react';
import type { LandingPage, Section } from '@landing-builder/core';
import {
  addSection,
  removeSection,
  moveSection,
  updateSectionProps,
  updateSectionStyle,
  toggleSection,
  duplicateSection,
} from '@landing-builder/core';

export interface PageStateActions {
  addSection: (section: Omit<Section, 'order'>, position?: number) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, newPosition: number) => void;
  updateSectionProps: (sectionId: string, props: Record<string, unknown>) => void;
  updateSectionStyle: (sectionId: string, style: Section['style']) => void;
  toggleSection: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  setPage: (page: LandingPage) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function usePageState(
  initial: LandingPage,
  onChange?: (page: LandingPage) => void,
): [LandingPage, PageStateActions] {
  const [page, setPageInternal] = useState(initial);
  const history = useRef<LandingPage[]>([initial]);
  const pointer = useRef(0);

  const push = useCallback(
    (next: LandingPage) => {
      history.current = history.current.slice(0, pointer.current + 1);
      history.current.push(next);
      pointer.current++;
      setPageInternal(next);
      onChange?.(next);
    },
    [onChange],
  );

  const actions: PageStateActions = {
    addSection: useCallback((s, pos) => push(addSection(page, s, pos)), [page, push]),
    removeSection: useCallback((id) => push(removeSection(page, id)), [page, push]),
    moveSection: useCallback((id, pos) => push(moveSection(page, id, pos)), [page, push]),
    updateSectionProps: useCallback((id, p) => push(updateSectionProps(page, id, p)), [page, push]),
    updateSectionStyle: useCallback((id, s) => push(updateSectionStyle(page, id, s)), [page, push]),
    toggleSection: useCallback((id) => push(toggleSection(page, id)), [page, push]),
    duplicateSection: useCallback((id) => push(duplicateSection(page, id)), [page, push]),
    setPage: useCallback((p) => push(p), [push]),
    undo: useCallback(() => {
      if (pointer.current > 0) {
        pointer.current--;
        const prev = history.current[pointer.current];
        setPageInternal(prev);
        onChange?.(prev);
      }
    }, [onChange]),
    redo: useCallback(() => {
      if (pointer.current < history.current.length - 1) {
        pointer.current++;
        const next = history.current[pointer.current];
        setPageInternal(next);
        onChange?.(next);
      }
    }, [onChange]),
    canUndo: pointer.current > 0,
    canRedo: pointer.current < history.current.length - 1,
  };

  return [page, actions];
}
