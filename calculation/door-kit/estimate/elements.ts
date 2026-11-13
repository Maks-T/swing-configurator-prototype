import { toNumber } from '../legacy/num';

import type { EstimateBuilder, EstimateElement } from './legacy-estimate';
import type { LegacyData } from '../legacy/legacy-data';
import type { ConfigRow, PriceRow } from '../legacy/types';

/** Строка прайса → элемент сметы */
export function element(
  row: PriceRow,
  patch: Partial<EstimateElement> = {}
): EstimateElement {
  return {
    name: row.name,
    unit: row.unit ?? '',
    priceEUR: row.priceEUR ?? 0,
    priceIn: row.priceIn ?? 0,
    weight: row.weight ?? 0,
    sku: row.key,
    ...patch,
  };
}

/** Добавить позицию прайса по id; нет в прайсе — позиция-заглушка */
export function addPrice(
  es: EstimateBuilder,
  data: LegacyData,
  id: string | undefined,
  count: number,
  prefix = '',
  patch: Partial<EstimateElement> = {}
): void {
  const row = data.price(id);
  if (!row) {
    if (id) {
      es.addMissing(prefix, id, count);
    }
    return;
  }
  es.add(prefix, element(row, patch), count);
}

/** Позиция по строке списания: price(cfg.param1) × count × cfg.value */
export function addByConfig(
  es: EstimateBuilder,
  data: LegacyData,
  cfg: ConfigRow | undefined,
  count = 1,
  prefix = ''
): void {
  if (!cfg) {
    return;
  }
  addPrice(es, data, String(cfg.param1 ?? ''), count * toNumber(cfg.value), prefix);
}
