import type { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <
  TState extends object,
  S extends UseBoundStore<StoreApi<TState>>,
>(
  _store: S
) => {
  const store = _store as WithSelectors<S>;

  store.use = {} as WithSelectors<S>['use'];

  for (const key of Object.keys(store.getState()) as Array<keyof TState>) {
    store.use[key] = () => store((state) => state[key]);
  }

  return store;
};
