import { getCoverOptions, type LegacyData, type PriceRow } from '@calculation/door-kit';

export type CoverGroup = 'polymer' | 'ral' | 'anodize';

export const COVER_GROUPS: { id: CoverGroup; title: string }[] = [
  { id: 'polymer', title: 'Полимер' },
  { id: 'ral', title: 'RAL' },
  { id: 'anodize', title: 'Анодирование' },
];

/** Группа покрытия по артикулу (для открытия нужной вкладки) */
export function getCoverGroup(data: LegacyData, sku: string): CoverGroup {
  const type = data.price(sku)?.type ?? '';
  if (/^colorRal/i.test(type)) {
    return 'ral';
  }
  return /anod/i.test(type) ? 'anodize' : 'polymer';
}

export function getCoverList(data: LegacyData, group: CoverGroup): PriceRow[] {
  return getCoverOptions(data)[group];
}
