import { createEntityKeys } from '@/shared/lib/utils';

export const doorCatalogFabricKeys = createEntityKeys('doorCatalog', {
  data: () => ['doorCatalog', 'data'] as const,
});

/** URL выгрузки данных дверей (в прототипе обслуживается мок-API) */
export const DOOR_IMPORT_DATA_URL = '/v1/doors/import-data';
