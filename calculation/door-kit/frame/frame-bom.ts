import { toNumber } from '../legacy/num';
import { calcProfile, withWeight } from '../legacy/profile';

import { addByConfig, addPrice, element } from '../estimate/elements';

import { addHinges, type HingeContext } from './hinges';

import type { EstimateBuilder } from '../estimate/legacy-estimate';
import type { LegacyData } from '../legacy/legacy-data';
import type { ConfigRow, PriceRow } from '../legacy/types';
import type { DoorKeys, DoorSetup } from '../setup';
import type { DoorSizes } from '../sizes';

/** getCoverColor: ключ расхода покрытия по типу покрытия */
export function coverKey(cover: PriceRow | undefined): string {
  const t = (cover?.type ?? '').toLowerCase();
  if (t.includes('polym')) {
    return 'cover-polymer';
  }
  if (t.includes('ral')) {
    return 'cover-ral';
  }
  if (t.includes('anod')) {
    return 'cover-anodize';
  }
  return '';
}

/** Название типа покрытия для подписи позиции */
export function coverKindLabel(cover: PriceRow | undefined): string {
  const key = coverKey(cover);
  return key === 'cover-anodize'
    ? 'анодирование'
    : key === 'cover-ral'
      ? 'эмаль'
      : 'полимер';
}

/** Покраска профиля короба: длина в мм × расход из списания */
function addFrameCover(
  fs: EstimateBuilder,
  data: LegacyData,
  setup: DoorSetup,
  config: Record<string, ConfigRow>,
  lengthMm: number
): void {
  const cover = data.price(setup.frameCoverSku);
  if (!cover) {
    return;
  }
  const rate = toNumber(config[coverKey(cover)]?.value);
  fs.add(
    'Окрашивание:',
    element(cover, { name: `${cover.name} (${lengthMm}мм) ${coverKindLabel(cover)}` }),
    (lengthMm / 1e3) * rate
  );
}

/** Упаковка короба: картон и скотч */
function addPackaging(
  fs: EstimateBuilder,
  data: LegacyData,
  config: Record<string, ConfigRow>
): void {
  addByConfig(fs, data, config.cardboard);
  addByConfig(fs, data, config.packGlueTape);
}

/** Фреза и сверло */
export function addDrillConsuming(
  es: EstimateBuilder,
  data: LegacyData,
  config: Record<string, ConfigRow>
): void {
  addByConfig(es, data, config.consumCutter);
  addByConfig(es, data, config.consumDrill);
}

/** Обезжириватель и растворитель по площади профиля короба */
function addFrameSolvent(
  fs: EstimateBuilder,
  data: LegacyData,
  config: Record<string, ConfigRow>,
  area: number
): void {
  const fat = data.price(String(config.solvent?.param1 ?? ''));
  if (fat) {
    fs.add(
      '',
      element(fat, { name: `${fat.name} (${area.toFixed(4)}м2)` }),
      area * toNumber(config.solvent?.value)
    );
  }
  addPrice(
    fs,
    data,
    String(config.alcohol?.param1 ?? ''),
    area * toNumber(config.alcohol?.value)
  );
}

/** Цена короба за погонаж (frameSetPrice): строка прайса с param1 = id короба */
function addFramePrice(
  fs: EstimateBuilder,
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys,
  sizes: DoorSizes
): void {
  const profile = data.price(String(keys.frameConfig.mainProfile?.param1 ?? ''));
  const count = calcProfile(
    [sizes.frameHeight, sizes.frameHeight, keys.frameJumper ? sizes.frameWidth : 0],
    toNumber(profile?.param2),
    toNumber(profile?.param3)
  );
  const price = data.priceByParam({ param1: setup.frame })[0];
  if (price) {
    fs.add('', element(price, { name: 'Короб', role: 'framePrice' }), count);
  }
}

/** Короба Standart51, Monoblock, Monoblock-B (frameSt) */
function frameStandard(fs: EstimateBuilder, ctx: HingeContext): void {
  const { data, setup, keys, sizes } = ctx;
  const fc = keys.frameConfig;
  const dc = keys.doorPartConfig;
  const main = data.price(String(fc.mainProfile?.param1 ?? ''));
  let mainLength = sizes.frameHeight * 2;
  if (keys.frameJumper) {
    mainLength += sizes.frameWidth;
  }
  const profileArea = (mainLength * toNumber(main?.param4)) / 1e6;
  let count = calcProfile(
    [sizes.frameHeight, sizes.frameHeight, keys.frameJumper ? sizes.frameWidth : 0],
    toNumber(main?.param2),
    toNumber(main?.param3)
  );

  if (!keys.isNoFrame && main) {
    fs.add('', element(withWeight(main, count)), count);
  }

  // Наличники и добор — в следующей версии (calcCasing), площадь и длина 0
  const casingArea = 0;
  const casingLength = 0;

  if (!keys.isNoFrame) {
    const seal = dc.sealantFrame;
    count = (mainLength * toNumber(seal?.value)) / 1000;
    addPrice(fs, data, String(seal?.param1 ?? ''), count);

    if (keys.frameJumper) {
      count = toNumber(fc.edgeConnector?.value);
      addPrice(fs, data, String(fc.edgeConnector?.param1 ?? ''), count);
      addPrice(
        fs,
        data,
        String(fc.fixEdge?.param1 ?? ''),
        count * toNumber(fc.fixEdge?.value)
      );
    }
  }

  addHinges(fs, ctx, fc);

  // Легаси: число пластин считается от последнего count (уголки при перемычке,
  // длина уплотнителя без перемычки) — перенесено как есть, см. README
  const plank = fc.fixHingePlank;
  count *= toNumber(plank?.value);
  if (count < toNumber(plank?.param4)) {
    count = toNumber(plank?.param4);
  }
  addPrice(fs, data, String(plank?.param1 ?? ''), count);
  addPrice(
    fs,
    data,
    String(fc.fixPlank?.param1 ?? ''),
    count * toNumber(fc.fixPlank?.value)
  );

  if (mainLength + casingLength) {
    const length = keys.isNoFrame ? casingLength * 1e3 : mainLength + casingLength * 1e3;
    if (length) {
      addFrameCover(fs, data, setup, fc, length);
    }
  }

  if (!keys.isNoFrame) {
    addFrameSolvent(fs, data, fc, profileArea + casingArea);
    addPackaging(fs, data, fc);
    addDrillConsuming(fs, data, fc);
  }
}

/** Короб Modula51 (frameModula): три профиля с запасом 100 мм на покраску */
function frameModula(fs: EstimateBuilder, ctx: HingeContext): void {
  const { data, setup, keys, sizes } = ctx;
  const fc = keys.frameConfig;
  const length = sizes.frameHeight * 2 + (keys.frameJumper ? sizes.frameWidth : 0);
  const lengthReserve = length + 100 * (2 + Number(keys.frameJumper));
  const main = data.price(String(fc.mainProfile?.param1 ?? ''));
  const profileArea = (lengthReserve * toNumber(main?.param4)) / 1e6;
  const count = lengthReserve / 1e3;
  let allLength = 0;

  if (!keys.isNoFrame) {
    for (const key of ['mainProfile', 'secondProfile', 'addProfile']) {
      const row = data.price(String(fc[key]?.param1 ?? ''));
      allLength += lengthReserve;
      if (row) {
        fs.add('', element(withWeight(row, count)), count);
      }
    }
  }

  if (allLength) {
    addFrameCover(fs, data, setup, fc, allLength);
  }

  if (!keys.isNoFrame) {
    addByConfig(fs, data, fc.edgeF);
    const dowel = fc.dowel;
    const step = toNumber(dowel?.param2) || 1;
    const dowels = Math.ceil((sizes.frameHeight * 2) / step + sizes.frameWidth / step);
    addPrice(fs, data, String(dowel?.param1 ?? ''), dowels);
    addPrice(fs, data, String(fc.dowelFix?.param1 ?? ''), dowels);
    addPrice(fs, data, String(fc.sealant?.param1 ?? ''), lengthReserve / 1e3);
  }

  addHinges(fs, ctx, fc);

  if (!keys.isNoFrame) {
    addFrameSolvent(fs, data, fc, profileArea);
    addPackaging(fs, data, fc);
  }
}

const FRAME_NAMES = (data: LegacyData, frame: string): string =>
  String(data.config(frame)?.value ?? frame);

/** Группа «Короб» сметы (frameAddGroup + frameCalc) */
export function calculateFrame(
  es: EstimateBuilder,
  ctx: HingeContext
): EstimateBuilder | null {
  const { data, setup, keys, sizes } = ctx;
  if (keys.isNoFrame) {
    return null;
  }
  let name = `${FRAME_NAMES(data, setup.frame)}: ${sizes.frameWidth}*${sizes.frameHeight} мм`;
  if (setup.isNoDoor) {
    const leaf = sizes.doors[0];
    name += `, под полотно ${String(data.config(setup.door)?.value ?? setup.door)}: ${leaf?.width ?? 0}*${leaf?.height ?? 0} мм`;
  }
  const fs = es.add('', {
    id: 'frame',
    name,
    unit: 'шт',
    customMargin: setup.margin,
    customDiscount: setup.discount,
    role: 'frame',
  });

  switch (keys.frameType) {
    case 'standart51':
    case 'monoblock':
    case 'monoblock-b':
      addFramePrice(fs, data, setup, keys, sizes);
      frameStandard(fs, ctx);
      break;
    case 'modula51':
      addFramePrice(fs, data, setup, keys, sizes);
      frameModula(fs, ctx);
      break;
    default:
      ctx.warnings.push(`Расчёт короба ${setup.frame} не перенесён в прототип`);
  }
  return fs;
}

/** Части короба в полотне в режиме «Без короба» (calcFrameToDoor) */
export function calculateFrameToDoor(ds: EstimateBuilder, ctx: HingeContext): void {
  switch (ctx.keys.frameType) {
    case 'standart51':
    case 'monoblock':
    case 'monoblock-b':
      frameStandard(ds, ctx);
      break;
    case 'modula51':
      frameModula(ds, ctx);
      break;
    default:
      ctx.warnings.push(`Расчёт короба ${ctx.setup.frame} не перенесён в прототип`);
  }
}
