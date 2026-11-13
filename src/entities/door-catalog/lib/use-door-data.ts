import { useQuery } from '@tanstack/react-query';

import { DoorCatalogQueries } from '../api/queries';

import type { LegacyData } from '@calculation/door-kit';

/** Данные дверей для компонентов под CatalogGate */
export function useDoorData(): LegacyData {
  const { data } = useQuery(DoorCatalogQueries.getData());
  if (!data) {
    throw new Error('Door data is not loaded');
  }
  return data;
}
