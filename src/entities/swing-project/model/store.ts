import { current, isDraft } from 'immer';

import { createStore } from '@/shared/lib/store';

import { createDefaultSetup } from '../lib/create-default-setup';
import { normalizeSetup } from '../lib/normalize-setup';

import { HISTORY_LIMIT } from './consts';

import type {
  DecorSide,
  DoorSetup,
  HandleChoice,
  LeafInsert,
  LegacyData,
} from '@calculation/door-kit';
import type { SwingProject } from '@calculation/swing';

type ProjectState = {
  project: SwingProject | null;
  past: SwingProject[];
  future: SwingProject[];
};

type SwingProjectStore = ProjectState & {
  init: (data: LegacyData, draft?: SwingProject | null) => void;
  hydrate: (project: SwingProject, data: LegacyData) => void;
  rename: (name: string) => void;
  patch: (patch: Partial<DoorSetup>, data: LegacyData) => void;
  setOpening: (patch: Partial<DoorSetup['opening']>) => void;
  setInsert: (side: DecorSide, insert: LeafInsert | null, data: LegacyData) => void;
  setHandle: (patch: Partial<HandleChoice>, data: LegacyData) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
};

const plain = <T>(value: T): T =>
  structuredClone(isDraft(value) ? current(value) : value);

function createInitialState(): ProjectState {
  return { project: null, past: [], future: [] };
}

function snapshot(state: ProjectState): void {
  if (!state.project) {
    return;
  }
  state.past.push(plain(state.project));
  if (state.past.length > HISTORY_LIMIT) {
    state.past.shift();
  }
  state.future = [];
}

export const useSwingProjectStore = createStore<SwingProjectStore>((set) => ({
  ...createInitialState(),

  init: (data, draft) =>
    set((state) => {
      state.project = draft
        ? { ...draft, setup: normalizeSetup(draft.setup, data) }
        : { name: 'Дверь 1', setup: createDefaultSetup(data) };
      state.past = [];
      state.future = [];
    }),

  hydrate: (project, data) =>
    set((state) => {
      snapshot(state);
      state.project = { ...project, setup: normalizeSetup(project.setup, data) };
    }),

  rename: (name) =>
    set((state) => {
      if (state.project) {
        state.project.name = name;
      }
    }),

  patch: (patch, data) =>
    set((state) => {
      if (!state.project) {
        return;
      }
      snapshot(state);
      state.project.setup = normalizeSetup(
        { ...plain(state.project.setup), ...patch },
        data
      );
    }),

  setOpening: (patch) =>
    set((state) => {
      if (!state.project) {
        return;
      }
      snapshot(state);
      Object.assign(state.project.setup.opening, patch);
    }),

  setInsert: (side, insert, data) =>
    set((state) => {
      if (!state.project) {
        return;
      }
      snapshot(state);
      const inserts = { ...plain(state.project.setup.inserts) };
      if (insert) {
        inserts[side] = insert;
      } else {
        delete inserts[side];
      }
      state.project.setup = normalizeSetup(
        { ...plain(state.project.setup), inserts },
        data
      );
    }),

  setHandle: (patch, data) =>
    set((state) => {
      if (!state.project) {
        return;
      }
      snapshot(state);
      const handle = { ...plain(state.project.setup.handle), ...patch };
      state.project.setup = normalizeSetup(
        { ...plain(state.project.setup), handle },
        data
      );
    }),

  undo: () =>
    set((state) => {
      const prev = state.past.pop();
      if (!prev || !state.project) {
        return;
      }
      state.future.push(plain(state.project));
      state.project = prev;
    }),

  redo: () =>
    set((state) => {
      const next = state.future.pop();
      if (!next || !state.project) {
        return;
      }
      state.past.push(plain(state.project));
      state.project = next;
    }),

  reset: () =>
    set((state) => {
      Object.assign(state, createInitialState());
    }),
}));
