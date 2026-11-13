import { queryOptions } from '@tanstack/react-query';

import { legacyDataFromImport, type DoorImportData } from '@calculation/door-kit';

import { doorCatalogFabricKeys } from '../model/consts';

import { DoorCatalogHttp } from './http';

export class DoorCatalogQueries {
  static getData() {
    return queryOptions({
      queryKey: doorCatalogFabricKeys.data(),
      queryFn: async ({ signal }) => {
        const data = await DoorCatalogHttp.getImportData(signal);
        return legacyDataFromImport(data as unknown as DoorImportData);
      },
      staleTime: Infinity,
    });
  }
}
