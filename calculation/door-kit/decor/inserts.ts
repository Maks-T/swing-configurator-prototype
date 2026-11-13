import { addPrice, element } from '../estimate/elements';
import { getMinMax, multiByPercent, toNumber } from '../legacy/num';
import { withWeight } from '../legacy/profile';

import type { EstimateBuilder } from '../estimate/legacy-estimate';
import type { LegacyData } from '../legacy/legacy-data';
import type { PriceRow } from '../legacy/types';
import type { DecorSide, DoorKeys, DoorSetup } from '../setup';
import type { LeafSize } from '../sizes';

/** Вставка стороны полотна с размерами (DecorItem легаси, одна на сторону) */
export type InsertPart = {
  side: DecorSide;
  sku: string;
  row: PriceRow;
  width: number;
  height: number;
  /** м² */
  area: number;
  /** м (периметр в метрах, как в легаси) */
  perimeter: number;
  glass: boolean;
  opacity: boolean;
  /** Толщина стекла, мм (param3) */
  deep: number;
  hardness: boolean;
  /** Наценка за размер, % */
  sizeMargin: { w: number; h: number };
  borderSku?: string;
};

export type InsertCheck = { side: DecorSide; message: string };

/** Отступы вставки от полотна: c_40, id = padding-<doorPart>, по стороне, направлению и толщине */
function decorPadding(
  data: LegacyData,
  keys: DoorKeys,
  setup: DoorSetup,
  side: DecorSide,
  deep: number
): { w: number; h: number; wHard: number; hHard: number } {
  const id = `padding-${keys.doorPart}`;
  const direct = setup.openSide.includes('inside') ? 'inside' : 'outside';
  let rows = data.configByParam({ id, param1: side, param2: direct });
  if (rows.length === 0) {
    rows = data.configByParam({ id });
  }
  const byKey = new Map(rows.map((r) => [String(r.key), r]));
  const row = byKey.get(String(deep)) ?? byKey.get('other');
  return {
    w: toNumber(row?.param3),
    h: toNumber(row?.param4),
    wHard: toNumber(row?.param5),
    hHard: toNumber(row?.param6),
  };
}

/** setSizeMargin: наценка вставки за ширину/высоту по шагам c_00_margin */
function sizeMargin(
  data: LegacyData,
  row: PriceRow,
  width: number,
  height: number
): { w: number; h: number } {
  const query = { key: row.type, type: row.group };
  const params = (id: string): string[] => {
    const cfg = data.configFirst({ ...query, id });
    if (!cfg) {
      return [];
    }
    const values = Array.from({ length: 15 }, (_, i) =>
      String(cfg[`param${i + 1}`] ?? '')
    );
    const last = values.reduce((acc, v, i) => (v ? i : acc), -1);
    return values.slice(0, last + 1);
  };
  const stepW = params('sizeStepWidth');
  const stepH = params('sizeStepHeight');
  const marginW = params('sizeMarginWidth');
  const marginH = params('sizeMarginHeight');
  let useW: string | undefined;
  let useH: string | undefined;
  stepW.forEach((step, i) => {
    if (width > toNumber(step)) {
      useW = marginW[i];
    }
  });
  stepH.forEach((step, i) => {
    if (height > toNumber(step)) {
      useH = marginH[i];
    }
  });
  if (useW !== undefined || useH !== undefined) {
    return { w: toNumber(useW), h: toNumber(useH) };
  }
  const base = toNumber(data.configFirst({ ...query, id: 'sizeMarginBase' })?.value);
  return { w: base, h: base };
}

/** Вставки полотна по сторонам: размеры, площадь, наценка за размер */
export function resolveInserts(
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys,
  leaf: LeafSize
): { parts: InsertPart[]; issues: InsertCheck[] } {
  const parts: InsertPart[] = [];
  const issues: InsertCheck[] = [];

  for (const side of keys.decorSides) {
    const insert = setup.inserts[side];
    const row = insert ? data.price(insert.sku) : undefined;
    if (!insert || !row) {
      continue;
    }
    const glass = /glass/i.test(row.type ?? '');
    const deep = toNumber(row.param3);
    const hardnessV = glass ? toNumber(row.param5) : 0;
    const pad = decorPadding(data, keys, setup, side, deep);
    let hardness = hardnessV > 0;
    const plainH = leaf.height - pad.h;
    if (
      !hardness &&
      plainH > 2500 &&
      (row.group ?? '').toLowerCase().includes('крашенные')
    ) {
      hardness = true;
    }
    const width = leaf.width - (hardness ? pad.wHard : pad.w);
    const height = leaf.height - (hardness ? pad.hHard : pad.h);

    const maxH = row.height ?? 0;
    const maxW = row.width ?? 0;
    if (maxH && height > maxH) {
      issues.push({
        side,
        message: `Вставка ${row.name}: высота ${height} мм больше допустимой ${maxH} мм`,
      });
    }
    if (maxW && width >= maxW) {
      issues.push({
        side,
        message: `Вставка ${row.name}: ширина ${width} мм больше допустимой ${maxW} мм`,
      });
    }

    parts.push({
      side,
      sku: insert.sku,
      row,
      width,
      height,
      area: (height * width) / 1e6,
      perimeter: ((height + width) * 2) / 1e3,
      glass,
      opacity: glass ? row.param2 === '+' : false,
      deep,
      hardness,
      sizeMargin: sizeMargin(data, row, width, height),
      ...(insert.borderSku ? { borderSku: insert.borderSku } : {}),
    });
  }
  return { parts, issues };
}

const isTechnoOrSpazio = (doorType: string): boolean => /techno|spazio/.test(doorType);

/** Плёнки для стёкол (addGlassFilm) */
function addGlassFilm(
  ds: EstimateBuilder,
  data: LegacyData,
  keys: DoorKeys,
  part: InsertPart
): void {
  const group = part.row.group ?? '';
  const films = String(data.configFirst({ id: 'glassFilms', key: group })?.value ?? '');
  for (const filmKey of ['film400', 'film800', 'filmTec']) {
    if (!films.includes(filmKey)) {
      continue;
    }
    const film = data.price(filmKey);
    if (!film) {
      continue;
    }
    const isTec = filmKey === 'filmTec';
    const { min, max } = getMinMax(film.param1);
    if (!isTec && !isTechnoOrSpazio(keys.doorType)) {
      continue;
    }
    if (
      isTec ||
      (min <= part.width && part.width <= max) ||
      part.width > toNumber(film.param2)
    ) {
      ds.add('', element(film), (part.height + 200 * Number(!isTec)) / 1e3);
    }
  }
}

const SIDE_PREFIX: Record<DecorSide, string> = {
  front: 'Отделка лицевая:',
  back: 'Отделка тыльная:',
};

/** decorationCalc: стекло/вставка по сторонам, плёнки, окантовка прозрачных */
export function addInserts(
  ds: EstimateBuilder,
  data: LegacyData,
  keys: DoorKeys,
  parts: readonly InsertPart[]
): void {
  for (const part of parts) {
    const k = multiByPercent(part.sizeMargin.w) * multiByPercent(part.sizeMargin.h);
    const base = element(withWeight(part.row, part.area), { role: 'decor' });
    const name = `${part.row.name} ${part.width}*${part.height} мм`;
    ds.add(
      SIDE_PREFIX[part.side],
      {
        ...base,
        name: base.name.replace(part.row.name, name),
        priceEUR: (base.priceEUR ?? 0) * k,
        priceIn: (base.priceIn ?? 0) * k,
      },
      part.area
    );
    if (part.glass) {
      addGlassFilm(ds, data, keys, part);
    }
    if (isTechnoOrSpazio(keys.doorType) && part.opacity && part.borderSku) {
      addPrice(ds, data, part.borderSku, part.area, 'Окантовка,');
      const tec = data.price('filmTec');
      if (tec) {
        const filmWidth = toNumber(tec.param1) / 1e3;
        const rollWidth = toNumber(tec.param2) / 1e3 || 1;
        ds.add('', element(tec), (part.perimeter * filmWidth) / rollWidth);
      }
    }
  }
}

export const haveGlass = (parts: readonly InsertPart[]): boolean =>
  parts.some((p) => p.glass);
export const haveOpacity = (parts: readonly InsertPart[]): boolean =>
  parts.some((p) => p.opacity);
export const glassArea = (parts: readonly InsertPart[]): number =>
  parts.filter((p) => p.glass).reduce((a, p) => a + p.area, 0);
