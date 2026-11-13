import { getEnum, toNumber } from './legacy/num';

import type { LegacyData } from './legacy/legacy-data';
import type { ConfigRow } from './legacy/types';
import type { DoorKeys, DoorSetup } from './setup';

export type LeafSize = {
  width: number;
  height: number;
  perimeter: number;
  /** Стандартный размер (без наценки за нестандарт) */
  baseSize: boolean;
};

export type DoorSizes = {
  /** Отступы проём → короб, мм (сумма верх+низ, лево+право) */
  framePadding: { h: number; w: number };
  frameWidth: number;
  frameHeight: number;
  framePerimeter: number;
  /** Ширина профиля короба, мм (param1 профиля) */
  frameProfileWidth: number;
  /** Отступы короб → полотно, мм */
  doorPadding: { h: number; w: number };
  doors: LeafSize[];
  doorWidth: number;
  doorHeight: number;
  doorWidthMax: number;
  doorProfileWidthV: number;
  doorProfileWidthH: number;
  doorPerimeter: number;
};

export type SizeIssue = {
  field: 'width' | 'height';
  message: string;
  min: number;
  max: number;
};

const PADDING = {
  FRAME: 'sizeFramePadding',
  FRAME_NO_JUMPER: 'sizeFramePaddingNoJumper',
  DOOR: 'sizeDoorPadding',
  DOOR_NO_JUMPER: 'sizeDoorPaddingNoJumper',
} as const;

/** getFramePadding: сначала c_11 (по полотну и коробу), затем c_10 (по коробу) */
function framePadding(
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys
): ConfigRow | undefined {
  const id = keys.frameJumper ? PADDING.FRAME : PADDING.FRAME_NO_JUMPER;
  return (
    data.configFirst({ id, key: keys.doorPart, param5: setup.frame }) ??
    data.configFirst({ id, key: keys.framePart })
  );
}

/** getDoorPadding: id с материалом полотна и типом петли (hidden/overhead) */
function doorPadding(
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys
): ConfigRow | undefined {
  const base = keys.frameJumper ? PADDING.DOOR : PADDING.DOOR_NO_JUMPER;
  const id = `${base}-${keys.doorMaterial}-${keys.hingeKind}`;
  const key = setup.door.includes('system') ? keys.doorPart : keys.framePart;
  return (
    data.configFirst({ id, key: keys.doorPart, param5: setup.frame }) ??
    data.configFirst({ id, key })
  );
}

/** Стандартные ширины/высоты полотна (sizeBaseWidth/Height из c_00_margin) */
function baseSizes(
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys
): { widths: string[]; heights: string[] } {
  const list = (id: string): string[] => {
    const row = data.configFirst({ id, key: setup.door });
    if (keys.doorMaterial === 'alum') {
      return row?.value ? getEnum(row.value) : [];
    }
    // МДФ: значения в param1..N (getParamArray)
    return row
      ? Object.entries(row)
          .filter(([k, v]) => k.startsWith('param') && v)
          .map(([, v]) => String(v))
      : [];
  };
  return { widths: list('sizeBaseWidth'), heights: list('sizeBaseHeight') };
}

/**
 * Размеры проём → короб → полотно для распашной одностворчатой двери
 * (sizeFrameCalc + sizeDoorCalc[SWING] легаси).
 */
export function calculateSwingSizes(
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys
): DoorSizes {
  const { opening } = setup;
  const fp = framePadding(data, setup, keys);
  const paddingH = toNumber(fp?.param1) + toNumber(fp?.param2);
  const paddingW = toNumber(fp?.param3) + toNumber(fp?.param4);
  let frameHeight = opening.height - paddingH;
  let frameWidth = opening.width - paddingW;

  const frameProfile = data.price(String(keys.frameConfig.mainProfile?.param1 ?? ''));
  const frameProfileWidth = toNumber(frameProfile?.param1);

  const dp = doorPadding(data, setup, keys);
  const doorPad = {
    h: toNumber(dp?.param1) + opening.floorGap,
    w: toNumber(dp?.param3) + toNumber(dp?.param4),
  };

  const h = keys.frameJumper
    ? frameHeight - doorPad.h - frameProfileWidth
    : opening.height - doorPad.h;
  const w = frameWidth - doorPad.w - frameProfileWidth * 2;
  let leafH = h;
  let leafW = w;

  // Тамбуратные полотна кратны 5 мм, разница уходит из короба
  if (keys.doorMaterial === 'mdf') {
    const dH = keys.frameJumper ? h % 5 : 0;
    const dW = w % 5;
    leafH = h - dH;
    leafW = w - dW;
    frameHeight -= dH;
    frameWidth -= dW;
  }

  const base = baseSizes(data, setup, keys);
  const isBase =
    base.widths.includes(String(leafW)) && base.heights.includes(String(leafH));
  const doorProfile = data.price(String(keys.doorConfig.mainProfile?.param1 ?? ''));
  const doorProfileWidth = toNumber(doorProfile?.param1);

  return {
    framePadding: { h: paddingH, w: paddingW },
    frameWidth,
    frameHeight,
    framePerimeter: (frameHeight + frameWidth) * 2,
    frameProfileWidth,
    doorPadding: doorPad,
    doors: [
      { width: leafW, height: leafH, perimeter: (leafW + leafH) * 2, baseSize: isBase },
    ],
    doorWidth: w,
    doorHeight: h,
    doorWidthMax: leafW,
    doorProfileWidthV: doorProfileWidth,
    doorProfileWidthH: doorProfileWidth,
    doorPerimeter: (h + w) * 2,
  };
}

/** checkSize: лимиты полотна по c_70 (id = тип изделия, key = полотно) */
export function checkLeafLimits(
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys,
  sizes: DoorSizes
): {
  issues: SizeIssue[];
  limits: { minH: number; maxH: number; minW: number; maxW: number } | null;
} {
  const rows = data.configByParam({ id: setup.kind, key: keys.doorType });
  if (rows.length === 0) {
    return { issues: [], limits: null };
  }
  const widths = sizes.doors.map((d) => d.width);
  const height = sizes.doorHeight;
  const minW = Math.min(...widths);
  const maxW = Math.max(...widths);
  let foundH = false;
  let foundW = false;
  let limits = { minH: 0, maxH: 0, minW: 0, maxW: 0 };

  for (const row of rows) {
    const l = {
      minH: toNumber(row.param1),
      maxH: toNumber(row.param2),
      minW: toNumber(String(row.param3 ?? '').split('-')[0]),
      maxW: toNumber(row.param4),
    };
    limits = l;
    if (l.minH <= height && height <= l.maxH) {
      foundH = true;
    }
    if (l.minW <= minW && maxW <= l.maxW) {
      foundW = true;
    }
  }

  const issues: SizeIssue[] = [];
  if (!foundH) {
    issues.push({
      field: 'height',
      min: limits.minH,
      max: limits.maxH,
      message: `Высота полотна ${height} мм вне допуска ${limits.minH}–${limits.maxH} мм`,
    });
  }
  if (!foundW) {
    issues.push({
      field: 'width',
      min: limits.minW,
      max: limits.maxW,
      message: `Ширина полотна ${maxW} мм вне допуска ${limits.minW}–${limits.maxW} мм`,
    });
  }
  return { issues, limits };
}
