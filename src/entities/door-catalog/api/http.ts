import { api } from '@/shared/api';

import { DOOR_IMPORT_DATA_URL } from '../model/consts';
import * as SDoorCatalog from '../model/schemas';

import type { ImportData } from '../model/types';

export class DoorCatalogHttp {
  static getImportData(signal?: AbortSignal) {
    return api<ImportData>({
      url: DOOR_IMPORT_DATA_URL,
      method: 'GET',
      contracts: { response: SDoorCatalog.ImportData },
      signal,
    });
  }
}
