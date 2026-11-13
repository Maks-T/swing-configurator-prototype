import { getEnum } from '../legacy/num';
import { SUPPORTED_LEAVES } from '../leaf/leaf-bom';
import { getHandles } from '../hardware/handle';

import type { LegacyData } from '../legacy/legacy-data';
import type { PriceRow } from '../legacy/types';

export type Option = { id: string; name: string; disabled?: boolean; hint?: string };

/** Короба, поддерживаемые прототипом */
export const SUPPORTED_FRAMES = [
  'standart51',
  'modula51',
  'monoblock',
  'monoblock-b',
] as const;

const selectName = (data: LegacyData, id: string): string =>
  String(data.config(id)?.value ?? id);

/** Короба для типа изделия и стороны открывания (typeOpen ∩ openSideFrame из c_50) */
export function getFrameOptions(
  data: LegacyData,
  kind: string,
  openSide: string
): Option[] {
  const byType = getEnum(data.configFirst({ key: 'typeOpen', id: kind })?.value ?? '');
  const bySide = new Set(
    getEnum(data.configFirst({ key: 'openSideFrame', id: openSide })?.value ?? '')
  );
  return byType
    .filter((id) => id && bySide.has(id))
    .map((id) => ({
      id,
      name: selectName(data, id),
      ...((SUPPORTED_FRAMES as readonly string[]).includes(id)
        ? {}
        : { disabled: true, hint: 'Расчёт короба в следующей версии' }),
    }));
}

/** Полотна для стороны открывания (openSideDoor из c_50) */
export function getLeafOptions(data: LegacyData, openSide: string): Option[] {
  return getEnum(data.configFirst({ key: 'openSideDoor', id: openSide })?.value ?? '')
    .filter(Boolean)
    .map((id) => ({
      id,
      name: selectName(data, id),
      ...((SUPPORTED_LEAVES as readonly string[]).includes(id)
        ? {}
        : { disabled: true, hint: 'МДФ-полотна в следующей версии' }),
    }));
}

/** Группы петель: пересечение по коробу и полотну в порядке hingeSelect */
export function getHingeGroups(data: LegacyData, frame: string, door: string): Option[] {
  const all = data.configByParam({ key: 'hingeSelect' });
  const byFrame = new Set(
    getEnum(data.configFirst({ key: 'hingeByFrame', id: frame })?.value ?? '')
  );
  const byDoor = new Set(
    getEnum(data.configFirst({ key: 'hingeByDoor', id: door })?.value ?? '')
  );
  return all
    .filter((row) => byFrame.has(row.id) && byDoor.has(row.id))
    .map((row) => ({ id: row.id, name: String(row.value ?? row.id) }));
}

/** Петли группы (цвета) */
export function getHinges(data: LegacyData, group: string): PriceRow[] {
  return data.priceByParam({ type: group });
}

/** Покрытия профиля: полимер (p_035), RAL (p_036), анодирование (p_037) */
export function getCoverOptions(data: LegacyData): {
  polymer: PriceRow[];
  ral: PriceRow[];
  anodize: PriceRow[];
} {
  const rows = data.allPrices();
  // Строки *Margin — служебные наценки за группу цвета, не выбираются
  const of = (re: RegExp): PriceRow[] =>
    rows.filter((r) => re.test(r.type ?? '') && !/Margin$/.test(r.type ?? '') && r.name);
  return { polymer: of(/polym/i), ral: of(/^colorRal/i), anodize: of(/anod/i) };
}

/** Стекла, доступные полотну (типы decor из c_50 door → только GLASS-*) */
export function getGlassOptions(data: LegacyData, door: string): PriceRow[] {
  const types = getEnum(data.configFirst({ key: 'door', id: door })?.value ?? '').filter(
    (t) => /^GLASS/.test(t)
  );
  return types.flatMap((type) => data.priceByParam({ type })).filter((r) => r.name);
}

/** Цвета окантовки прозрачного стекла */
export function getBorderOptions(data: LegacyData): PriceRow[] {
  return data.priceByParam({ type: 'glassBorderColor' });
}

/** Ручки полотна */
export function getHandleOptions(data: LegacyData, door: string): PriceRow[] {
  return getHandles(data, door).filter((r) => r.name);
}
