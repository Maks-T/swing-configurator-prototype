'use client';

import { create, type StateCreator, type StoreMutatorIdentifier } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSelectors } from './create-selectors';

type Mutators = [StoreMutatorIdentifier, unknown][];

export type StoreCreator<TStore, TMutators extends Mutators = []> = StateCreator<
  TStore,
  TMutators,
  [],
  TStore
>;

type ChainedCreator<TStore> = StateCreator<TStore, Mutators, Mutators, TStore>;

type StoreMiddleware<TStore> = (
  creator: ChainedCreator<TStore>
) => ChainedCreator<TStore>;

type ImmerCreator<TStore> = StateCreator<TStore, [['zustand/immer', never]], [], TStore>;

export const createStore = <TStore extends object>(
  creator: ImmerCreator<TStore>,
  middlewares: StoreMiddleware<TStore>[] = []
) => {
  let enhancedCreator: ChainedCreator<TStore> = immer(creator);

  for (let index = middlewares.length - 1; index >= 0; index -= 1) {
    const middleware = middlewares[index];
    if (middleware) {
      enhancedCreator = middleware(enhancedCreator);
    }
  }

  return createSelectors(create<TStore>()(enhancedCreator));
};

export type { StoreMiddleware };
