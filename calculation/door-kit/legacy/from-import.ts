import { LegacyData } from './legacy-data';

import type { ConfigRow, PriceRow } from './types';

/** Минимальная форма import_data.json, которую читает расчёт дверей */
export type DoorImportData = {
  products: { code: string; eav: { legacy: Omit<PriceRow, 'key'> } }[];
  complex_dictionaries: {
    code: string;
    records: { slug: string; meta: Record<string, unknown> }[];
  }[];
};

/** import_data.json → таблицы легаси */
export function legacyDataFromImport(data: DoorImportData): LegacyData {
  const config = data.complex_dictionaries.find((d) => d.code === 'door_legacy_config');
  if (!config) {
    throw new Error('Dictionary door_legacy_config is missing in import data');
  }
  return new LegacyData(
    data.products.map((p) => ({ key: p.code, row: { ...p.eav.legacy, key: p.code } })),
    config.records.map((r) => ({ key: r.slug, row: r.meta as ConfigRow }))
  );
}
