import { addPrice, addByConfig, element } from '../estimate/elements';
import { addDrillConsuming, coverKey, coverKindLabel } from '../frame/frame-bom';
import { getEnum, toNumber } from '../legacy/num';
import { calcProfile, withWeight } from '../legacy/profile';
import { glassArea, haveGlass, haveOpacity, type InsertPart } from '../decor/inserts';

import type { EstimateBuilder } from '../estimate/legacy-estimate';
import type { HingeContext } from '../frame/hinges';
import type { LegacyData } from '../legacy/legacy-data';
import type { ConfigRow } from '../legacy/types';
import type { LeafSize } from '../sizes';

export type LeafContext = HingeContext & {
  leaf: LeafSize;
  index: number;
  parts: InsertPart[];
};

type Cfg = Record<string, ConfigRow>;

const p1 = (cfg: ConfigRow | undefined): string => String(cfg?.param1 ?? '');

/** Наценка за нестандарт полотна (getDoorSizeMargin), % */
export function getDoorSizeMargin(data: LegacyData, ctx: LeafContext): number {
  if (ctx.keys.doorMaterial === 'alum') {
    const id = ctx.leaf.baseSize ? 'sizeMarginBase' : 'sizeMargin';
    return toNumber(data.configFirst({ id, key: ctx.keys.doorType })?.value);
  }
  return 0;
}

/** Цена полотна (doorSetPrice): строка прайса с param1 = id полотна, за м² */
function addLeafPrice(ds: EstimateBuilder, ctx: LeafContext): void {
  const { data, setup, leaf } = ctx;
  const row = data.priceByParam({ param1: setup.door })[0];
  if (!row) {
    ctx.warnings.push(`Нет цены полотна ${setup.door}`);
    return;
  }
  const count = (leaf.width * leaf.height) / 1e6;
  ds.add(
    '',
    element(withWeight(row, count), {
      name: 'Полотно',
      margin: getDoorSizeMargin(data, ctx),
      role: 'leafPrice',
    }),
    count
  );
}

/** Покраска профилей полотна, длина в мм */
function addLeafCover(
  ds: EstimateBuilder,
  ctx: LeafContext,
  cfg: Cfg,
  lengthMm: number
): void {
  const cover = ctx.data.price(ctx.setup.doorCoverSku);
  if (!cover) {
    return;
  }
  ds.add(
    'Окрашивание полотна:',
    element(cover, { name: `${cover.name} ${coverKindLabel(cover)}` }),
    (lengthMm / 1e3) * toNumber(cfg[coverKey(cover)]?.value)
  );
}

/** Обезжириватель + растворитель по площади профиля (мм²) */
function addSolvent(
  ds: EstimateBuilder,
  data: LegacyData,
  cfg: Cfg,
  areaMm2: number
): void {
  const count = areaMm2 / 1e6;
  const fat = data.price(p1(cfg.fatFree));
  if (fat) {
    ds.add(
      '',
      element(fat, { name: `${fat.name} (${count}м2)` }),
      count * toNumber(cfg.fatFree?.value)
    );
  }
  addPrice(ds, data, p1(cfg.solvent), count * toNumber(cfg.solvent?.value));
}

/** Спирт для стеклянных вставок */
function addAlcohol(
  ds: EstimateBuilder,
  data: LegacyData,
  cfg: Cfg,
  parts: readonly InsertPart[]
): void {
  const area = glassArea(parts);
  if (area) {
    addPrice(ds, data, p1(cfg.alcohol), area * toNumber(cfg.alcohol?.value));
  }
}

/** Упаковка полотна: пенопласт, плёнка, картон, скотч */
function addDoorPack(
  ds: EstimateBuilder,
  data: LegacyData,
  cfg: Cfg,
  leaf: LeafSize
): void {
  const styro = data.price(p1(cfg.styrofoam));
  if (styro) {
    ds.add(
      '',
      element(styro, { unit: 'шт' }),
      Math.ceil(leaf.perimeter / toNumber(cfg.styrofoam?.param2))
    );
  }
  addPrice(ds, data, p1(cfg.film), (leaf.height / 1e3) * 2 * toNumber(cfg.film?.value));
  addPrice(
    ds,
    data,
    p1(cfg.cardboard),
    Math.ceil(leaf.perimeter / toNumber(cfg.cardboard?.param2))
  );
  addPrice(
    ds,
    data,
    p1(cfg.packGlueTape),
    Math.ceil((leaf.width / 1e3) * toNumber(cfg.packGlueTape?.value))
  );
}

/** Зарезка под петли в полотне */
function addHingeCut(ds: EstimateBuilder, ctx: LeafContext, cfg: Cfg): void {
  if (!ctx.keys.isNoFrame && cfg.hingeCut) {
    addPrice(
      ds,
      ctx.data,
      p1(cfg.hingeCut),
      (ctx.hingeCount / ctx.doorCount) * toNumber(cfg.hingeCut.value)
    );
  }
}

/** Профиль-заглушка распашной двери (getSlideSealant, ветка swing): addProfile на две высоты */
function addPlugProfile(
  ds: EstimateBuilder,
  ctx: LeafContext,
  cfg: Cfg
): { area: number; length: number } {
  const row = ctx.data.price(p1(cfg.addProfile));
  if (!row) {
    return { area: 0, length: 0 };
  }
  const h = ctx.leaf.height;
  const count = calcProfile([h, h], toNumber(row.param2), toNumber(row.param3));
  ds.add('', element(withWeight(row, count)), count);
  return { area: h * 2 * toNumber(row.param4), length: h * 2 };
}

/** Уплотнитель под вставки по толщине стекла (addSealant, по doorPart) */
function addInsertSealant(ds: EstimateBuilder, ctx: LeafContext): void {
  const list = ctx.data.configByParam({ id: ctx.keys.doorPart, key: 'sealant' });
  const total = new Map<string, number>();
  for (const part of ctx.parts) {
    const cfg = list.find((row) => row.param2 === part.row.param3);
    if (cfg) {
      const id = p1(cfg);
      total.set(id, (total.get(id) ?? 0) + part.perimeter);
    }
  }
  for (const [id, count] of total) {
    addPrice(ds, ctx.data, id, count);
  }
}

/** Усиленный каркас (addStrongProfileSetup) */
function addStrongProfile(ds: EstimateBuilder, ctx: LeafContext, cfg: Cfg): void {
  const profileCfg = cfg.strongProfile;
  if (!profileCfg) {
    return;
  }
  const opacity = haveOpacity(ctx.parts);
  const profileCount = opacity
    ? 0
    : toNumber(profileCfg.value) * (ctx.leaf.height > 2300 ? 2 : 1);
  if (profileCount) {
    const row = ctx.data.price(p1(profileCfg));
    const count = ((ctx.leaf.width + 10) / 1e3) * profileCount;
    if (row) {
      ds.add('', element(withWeight(row, count)), count);
    }
  }
  const ext = cfg.strongExternalConnector;
  let count = toNumber(ext?.value) + toNumber(ext?.param2) * profileCount;
  addPrice(ds, ctx.data, p1(ext), count);
  count *= toNumber(cfg.strongExternalConnectorScrew?.value);
  addPrice(ds, ctx.data, p1(cfg.strongExternalConnectorScrew), count);
  addPrice(
    ds,
    ctx.data,
    p1(cfg.strongScrewWasher),
    count * toNumber(cfg.strongScrewWasher?.value)
  );
  addPrice(
    ds,
    ctx.data,
    p1(cfg.strongScrewNut),
    count * toNumber(cfg.strongScrewNut?.value)
  );
  const intCount = toNumber(cfg.strongInternalConnector?.value);
  addPrice(ds, ctx.data, p1(cfg.strongInternalConnector), intCount);
  addPrice(
    ds,
    ctx.data,
    p1(cfg.strongInternalConnectorScrew),
    intCount * toNumber(cfg.strongInternalConnectorScrew?.value)
  );
}

/** Крышка + праймер + скотч (Modula/Vella/Grafia/System) */
function addLidParts(ds: EstimateBuilder, data: LegacyData, cfg: Cfg): void {
  if (!cfg.lid) {
    return;
  }
  for (const key of ['lid', 'lidPrimer', 'lidScotch']) {
    addByConfig(ds, data, cfg[key]);
  }
}

/** Доборный элемент «МДФ.вставка» под замок AGB/Bonaiti */
function addMdfInsert(
  ds: EstimateBuilder,
  ctx: LeafContext,
  cfg: Cfg,
  hasLock: boolean
): void {
  if (!cfg.mdfInsert || !hasLock) {
    return;
  }
  addByConfig(ds, ctx.data, cfg.mdfInsert);
  addByConfig(ds, ctx.data, cfg.mdfInsertFix);
}

/** TECHNOFORM 40 / 51 (doorTf) */
function leafTechnoform(ds: EstimateBuilder, ctx: LeafContext): void {
  const { data, leaf, keys } = ctx;
  const cfg = data.part('technoform40Part');
  const isTf51 = keys.doorType.includes('51');
  const main = data.price(p1(cfg.mainProfile));
  let area = leaf.perimeter * toNumber(main?.param4);
  const mainLength = leaf.height * 2 + leaf.width * 2;
  let secondLength = 0;
  const parts4 = [leaf.height, leaf.height, leaf.width, leaf.width];

  if (main) {
    const count = calcProfile(parts4, toNumber(main.param2), toNumber(main.param3));
    ds.add('', element(withWeight(main, count)), count);
  }
  if (isTf51) {
    const second = data.price(p1(cfg.secondProfile));
    area += (leaf.height * 2 + leaf.width) * toNumber(second?.param4);
    secondLength = mainLength;
    if (second) {
      const count = calcProfile(parts4, toNumber(second.param2), toNumber(second.param3));
      ds.add('', element(withWeight(second, count)), count);
    }
  }

  const edge = toNumber(cfg.edgeF?.value);
  addPrice(ds, data, p1(cfg.edgeF), edge);
  addPrice(ds, data, p1(cfg.edgesFix), edge * toNumber(cfg.edgesFix?.value));
  if (isTf51) {
    addPrice(
      ds,
      data,
      p1(cfg.edgesFix2),
      Math.floor(leaf.perimeter / toNumber(cfg.edgesFix2?.param2)) + 1
    );
  }
  addPrice(
    ds,
    data,
    p1(cfg.glueDecor),
    (leaf.perimeter / 1e3) * 2 * toNumber(cfg.glueDecor?.value)
  );

  addStrongProfile(ds, ctx, cfg);
  addPlugProfile(ds, ctx, cfg);
  addHingeCut(ds, ctx, cfg);
  addLeafCover(ds, ctx, cfg, mainLength + secondLength);
  addSolvent(ds, data, cfg, area);
  addAlcohol(ds, data, cfg, ctx.parts);
  addDoorPack(ds, data, cfg, leaf);
  addDrillConsuming(ds, data, cfg);

  if (!haveOpacity(ctx.parts) && cfg.styrofoamFill) {
    const deep = toNumber(cfg.styrofoamFill.value);
    const w = leaf.width - ctx.sizes.doorProfileWidthV * 2;
    const h = leaf.height - ctx.sizes.doorProfileWidthH * 2;
    const row = data.price(p1(cfg.styrofoamFill));
    if (row) {
      ds.add(
        '',
        element(row, { name: `${row.name}(${w.toFixed(0)}x${h.toFixed(0)}*${deep})` }),
        (w * h * deep) / 1e9
      );
    }
  }
}

/** Vella / Grafia / Tropea (doorVella) */
function leafVella(ds: EstimateBuilder, ctx: LeafContext, hasLock: boolean): void {
  const { data, leaf, keys } = ctx;
  const cfg = keys.doorConfig;
  const main = data.price(p1(cfg.mainProfile));
  let area = leaf.height * 2 * toNumber(main?.param4);
  const mainLength = leaf.height * 2;
  if (main) {
    const count = calcProfile(
      [leaf.height, leaf.height],
      toNumber(main.param2),
      toNumber(main.param3)
    );
    ds.add('', element(withWeight(main, count)), count);
  }
  const second = data.price(p1(cfg.secondProfile));
  const secondLength = leaf.width * 2;
  area += leaf.width * 2 * toNumber(second?.param4);
  if (second) {
    const count = calcProfile(
      [leaf.width, leaf.width],
      toNumber(second.param2),
      toNumber(second.param3)
    );
    ds.add('', element(withWeight(second, count)), count);
  }
  const plug = addPlugProfile(ds, ctx, cfg);

  addByConfig(ds, data, cfg.edgeF);
  addByConfig(ds, data, cfg.edgesFix);
  addHingeCut(ds, ctx, cfg);
  addLeafCover(ds, ctx, cfg, mainLength + secondLength + plug.length);
  addInsertSealant(ds, ctx);
  addSolvent(ds, data, cfg, area);
  addAlcohol(ds, data, cfg, ctx.parts);
  addDoorPack(ds, data, cfg, leaf);
  addDrillConsuming(ds, data, cfg);
  addByConfig(ds, data, cfg.connCorner);
  addLidParts(ds, data, cfg);
  addMdfInsert(ds, ctx, cfg, hasLock);

  if (ctx.setup.hingeSku.includes('hingeO')) {
    for (const key of ['hingeScrew410', 'hingeScrew414']) {
      if (cfg[key]) {
        addPrice(
          ds,
          data,
          p1(cfg[key]),
          toNumber(cfg[key]?.value) * (ctx.hingeCount / ctx.doorCount)
        );
      }
    }
  }
}

/** Modula (doorModula) */
function leafModula(ds: EstimateBuilder, ctx: LeafContext, hasLock: boolean): void {
  const { data, leaf, keys } = ctx;
  const cfg = keys.doorConfig;
  const main = data.price(p1(cfg.mainProfile));
  let area = leaf.perimeter * toNumber(main?.param4);
  const mainLength = leaf.height * 2 + leaf.width * 2;
  if (main) {
    const count = calcProfile(
      [leaf.height, leaf.height, leaf.width, leaf.width],
      toNumber(main.param2),
      toNumber(main.param3)
    );
    ds.add('', element(withWeight(main, count)), count);
  }
  const plug = addPlugProfile(ds, ctx, cfg);
  area += plug.area;
  addByConfig(ds, data, cfg.edgeF);
  addByConfig(ds, data, cfg.edgesFix);
  addHingeCut(ds, ctx, cfg);
  addInsertSealant(ds, ctx);
  addLeafCover(ds, ctx, cfg, mainLength + plug.length);
  addSolvent(ds, data, cfg, area);
  addAlcohol(ds, data, cfg, ctx.parts);
  addDoorPack(ds, data, cfg, leaf);
  addDrillConsuming(ds, data, cfg);
  addLidParts(ds, data, cfg);
  addMdfInsert(ds, ctx, cfg, hasLock);
}

/** Spazio / Spazio light (doorSpazio) */
function leafSpazio(ds: EstimateBuilder, ctx: LeafContext): void {
  const { data, leaf, keys } = ctx;
  const cfg = data.part('spaziosgPart');
  const isLite = keys.doorType.includes('lt');
  const main = data.price(p1(cfg.mainProfile));
  let area = leaf.perimeter * toNumber(main?.param4);
  const mainLength = leaf.height * 2 + leaf.width * 2;
  if (main) {
    const count = calcProfile(
      [leaf.height, leaf.height, leaf.width, leaf.width],
      toNumber(main.param2),
      toNumber(main.param3)
    );
    ds.add('', element(withWeight(main, count)), count);
  }
  const plug = addPlugProfile(ds, ctx, cfg);
  area += plug.area;
  addByConfig(ds, data, cfg.edgeF);
  addByConfig(ds, data, cfg.edgesFix);
  addHingeCut(ds, ctx, cfg);
  let glue = leaf.perimeter * 1e-3 * toNumber(cfg.glueDecor?.value);
  if (!isLite) {
    glue *= 2;
  }
  addPrice(ds, data, p1(cfg.glueDecor), glue);
  addLeafCover(ds, ctx, cfg, mainLength + plug.length);
  addSolvent(ds, data, cfg, area);
  addAlcohol(ds, data, cfg, ctx.parts);
  addDoorPack(ds, data, cfg, leaf);
  addDrillConsuming(ds, data, cfg);
  addByConfig(ds, data, cfg.connCorner);
}

/** System (doorSystem) */
function leafSystem(ds: EstimateBuilder, ctx: LeafContext, hasLock: boolean): void {
  const { data, leaf, keys } = ctx;
  const cfg = keys.doorConfig;
  const main = data.price(p1(cfg.mainProfile));
  const area = leaf.perimeter * toNumber(main?.param4);
  const mainLength = leaf.height * 2 + leaf.width * 2;
  if (main) {
    const count = calcProfile(
      [leaf.height, leaf.height, leaf.width, leaf.width],
      toNumber(main.param2),
      toNumber(main.param3)
    );
    ds.add('', element(withWeight(main, count)), count);
  }
  const edge = toNumber(cfg.edgeF?.value);
  addPrice(ds, data, p1(cfg.edgeF), edge);
  addPrice(ds, data, p1(cfg.edgesFix), edge * toNumber(cfg.edgesFix?.value));
  addPlugProfile(ds, ctx, cfg);
  addHingeCut(ds, ctx, cfg);
  addLeafCover(ds, ctx, cfg, mainLength);
  addInsertSealant(ds, ctx);
  addSolvent(ds, data, cfg, area);
  addAlcohol(ds, data, cfg, ctx.parts);
  addDoorPack(ds, data, cfg, leaf);
  if (haveGlass(ctx.parts) && cfg.scotchSys) {
    const s = cfg.scotchSys;
    const count =
      (leaf.height < 2000
        ? Math.floor(leaf.height / toNumber(s.param2)) * toNumber(s.param3) * leaf.width
        : leaf.width * toNumber(s.param4)) / 1e3;
    addPrice(ds, data, p1(s), count);
  }
  addDrillConsuming(ds, data, cfg);
  addLidParts(ds, data, cfg);
  addMdfInsert(ds, ctx, cfg, hasLock);
}

/** Поддерживаемые прототипом алюминиевые полотна распашных дверей */
export const SUPPORTED_LEAVES = [
  'technoform40',
  'technoform51',
  'vellasg',
  'grafiasg',
  'tropeasg',
  'modulasg',
  'spaziosg',
  'spazioltsg',
  'systemsg',
] as const;

/** Цена полотна (первая позиция группы полотна) */
export { addLeafPrice };

/** Каркас полотна по типу (doorTf/doorVella/… легаси, без ручек и отделки) */
export function calculateLeafFrame(
  ds: EstimateBuilder,
  ctx: LeafContext,
  hasLock: boolean
): void {
  switch (ctx.keys.doorType) {
    case 'technoform40':
    case 'technoform51':
      leafTechnoform(ds, ctx);
      break;
    case 'vellasg':
    case 'grafiasg':
    case 'tropeasg':
      leafVella(ds, ctx, hasLock);
      break;
    case 'modulasg':
      leafModula(ds, ctx, hasLock);
      break;
    case 'spaziosg':
    case 'spazioltsg':
      leafSpazio(ds, ctx);
      break;
    case 'systemsg':
      leafSystem(ds, ctx, hasLock);
      break;
    default:
      ctx.warnings.push(
        `Расчёт полотна ${ctx.setup.door} не перенесён в прототип (МДФ — следующий этап)`
      );
  }
}

/** Список полотен для типа открывания и стороны (openSideDoor из c_50) */
export function getLeafIdsForOpenSide(data: LegacyData, openSide: string): string[] {
  const row = data.configFirst({ key: 'openSideDoor', id: openSide });
  return row?.value ? getEnum(row.value) : [];
}
