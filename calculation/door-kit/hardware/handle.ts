import { addPrice, element } from '../estimate/elements';
import { getEnum, toNumber } from '../legacy/num';
import { haveGlass, type InsertPart } from '../decor/inserts';

import type { EstimateBuilder } from '../estimate/legacy-estimate';
import type { LegacyData } from '../legacy/legacy-data';
import type { PriceRow } from '../legacy/types';
import type { DoorKeys, DoorSetup } from '../setup';

/** Комплектующие ручки (getAllHandleParts легаси) */
export type HandleParts = {
  handle: PriceRow;
  /** Отверстие под ручку (если ровно одно в прайсе) */
  hole?: string;
  /** Врезка */
  inCut?: string;
  /** Тип замка (тип в прайсе), по которому выбирается цвет */
  lock?: string;
  /** Корпус замка */
  lockBox?: string;
  /** Тип личинки */
  lockLarva?: string;
};

const searchKey = (v: string): string =>
  v
    .trim()
    .toLowerCase()
    .replaceAll(/(\s|_|-|\(|\))/gm, '');

/** Ручки, доступные полотну (config key=handle, id=полотно: id ручек и группы) */
export function getHandles(data: LegacyData, door: string): PriceRow[] {
  const ids = getEnum(data.configFirst({ key: 'handle', id: door })?.value ?? '').filter(
    Boolean
  );
  const direct = ids.flatMap((id) => {
    const row = data.price(id);
    return row ? [row] : [];
  });
  const byGroup = ids.flatMap((group) => data.priceByParam({ group }));
  const seen = new Set<string>();
  return [...direct, ...byGroup].filter((row) => {
    if (seen.has(row.key)) {
      return false;
    }
    seen.add(row.key);
    return true;
  });
}

export function resolveHandleParts(
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys,
  handleId: string
): HandleParts | null {
  const handle = data.price(handleId);
  if (!handle) {
    return null;
  }
  const holes = data.priceByParam({ type: 'hole', param1: handleId });
  const inCutKey = keys.doorMaterial === 'alum' ? 'handleInCutTS' : 'handleInCutTR';
  const inCut = data
    .configByParam({ key: inCutKey })
    .find((row) => String(row.value ?? '').includes(handleId))?.id;
  const lock = data
    .configByParam({ key: 'lockInCut' })
    .find((row) => String(row.value ?? '').includes(inCut ?? handleId))?.id;

  let lockBox: string | undefined;
  if (keys.decorSides.length !== 2) {
    const needle = searchKey(handleId);
    lockBox = data
      .configByParam({ key: 'lockBox' })
      .find((row) => searchKey(String(row.value ?? '')).includes(needle))?.id;
  }

  const larvaHandles = getEnum(data.config('larvaForHandle')?.value ?? '');
  const lockLarva = larvaHandles.includes(handleId)
    ? data
        .configByParam({ key: 'larvaOfThick' })
        .find((row) => String(row.value ?? '').includes(setup.door))?.id
    : undefined;

  return {
    handle,
    ...(holes.length === 1 && holes[0] ? { hole: holes[0].key } : {}),
    ...(inCut ? { inCut } : {}),
    ...(lock ? { lock } : {}),
    ...(lockBox ? { lockBox } : {}),
    ...(lockLarva ? { lockLarva } : {}),
  };
}

/** Типы замка для врезки (lockTypeSelect) */
export function getLockTypes(
  data: LegacyData,
  lock: string
): { id: string; name: string }[] {
  return data
    .configByParam({ key: 'lockTypeSelect', param1: lock })
    .map((row) => ({ id: row.id, name: String(row.value ?? row.id) }));
}

/** Замки (цвета) по типу врезки и типу замка */
export function getLocks(data: LegacyData, lock: string, lockType: string): PriceRow[] {
  return data.priceByParam({ type: lock, group: lockType });
}

/** Ручка распашной двери со всеми комплектующими (handle.js swing + addBackPlank) */
export function addSwingHandle(
  ds: EstimateBuilder,
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys,
  parts: readonly InsertPart[],
  warnings: string[]
): { hasLock: boolean } {
  const choice = setup.handle;
  if (!choice.handleSku) {
    return { hasLock: false };
  }
  const hp = resolveHandleParts(data, setup, keys, choice.handleSku);
  if (!hp) {
    warnings.push(`Ручка ${choice.handleSku} не найдена в прайсе`);
    return { hasLock: false };
  }
  const handleId = choice.handleSku;
  const hConfig = data.part(`${handleId}Part`);
  const front = parts.filter((p) => p.side === 'front');
  const back = parts.filter((p) => p.side === 'back');
  const countHole =
    Number(haveGlass(front)) +
    (keys.decorSides.length === 2 ? Number(haveGlass(back)) : 0);

  if (Object.keys(hConfig).length > 0) {
    const hs = ds.add('', element(hp.handle, { role: 'handle' }));
    for (const key of ['mainHandle', 'socket', 'socket2', 'lock']) {
      const cfg = hConfig[key];
      if (cfg) {
        addPrice(hs, data, String(cfg.param1 ?? ''), toNumber(cfg.value));
      }
    }
  } else {
    ds.add('', element(hp.handle, { role: 'handle' }));
  }

  // Основание Modula для ручек Gardena
  if (setup.door.includes('modula') && handleId.toLowerCase().includes('gardena')) {
    addPrice(ds, data, 'baseModulaKit', 1);
  }

  let holeBase = hp.handle;
  if (hp.inCut) {
    const inCut = data.price(hp.inCut);
    if (inCut) {
      ds.add('', element(inCut));
      holeBase = inCut;
    }
  }
  if (hp.hole && countHole) {
    const hole = data.priceByParam({ type: 'hole', param1: handleId })[0];
    if (hole) {
      ds.add('', element(hole), countHole * (holeBase.param1 === '+' ? 2 : 1));
    }
  }

  const lockType =
    choice.lockType ?? (hp.lock ? getLockTypes(data, hp.lock)[0]?.id : undefined) ?? '';
  let lockColor = '';
  if (hp.lock) {
    const lockRow =
      (choice.lockSku ? data.priceByParam({ id: choice.lockSku })[0] : undefined) ??
      getLocks(data, hp.lock, lockType)[0];
    if (lockRow) {
      lockColor = lockRow.param1 ?? '';
      const name =
        lockType === 'krona'
          ? `${lockRow.name} (${data.price(setup.doorCoverSku)?.name ?? ''})`
          : lockRow.name;
      ds.add('', element(lockRow, { name, role: 'lock' }));
      const screw = data.configFirst({
        key: `screw-${keys.doorMaterial}`,
        id: setup.door,
      });
      addPrice(ds, data, String(screw?.value ?? ''), 2);
    } else {
      warnings.push('Замок для выбранной ручки не найден');
    }
  }

  if (hp.lockBox) {
    const box = data.priceByParam({
      id: hp.lockBox,
      type: 'lockBox',
      group: setup.door,
    })[0];
    if (box) {
      ds.add(
        '',
        element(box, {
          name: `${box.name} (цвет - ${data.price(setup.doorCoverSku)?.name ?? ''})`,
        })
      );
    } else {
      warnings.push(`Корпус замка ${hp.lockBox} не найден для ${setup.door}`);
    }
  }

  if (hp.lockLarva && choice.larvaType) {
    const larva = data.priceByParam({ id: choice.larvaType, type: hp.lockLarva })[0];
    if (larva) {
      const name =
        choice.larvaType === 'key-wrap' && choice.larvaSide
          ? `${larva.name} ${choice.larvaSide}`
          : larva.name;
      ds.add('', element(larva, { name }));
    }
  }

  // Вставка под AGB
  if (getEnum(data.config('agbInsertDoor')?.value ?? '').includes(setup.door)) {
    const insert = data.priceByParam({ type: 'agbInsert', group: lockType })[0];
    if (
      insert &&
      (hp.lock || getEnum(data.config('agbInsertHandle')?.value ?? '').includes(handleId))
    ) {
      ds.add('', element(insert), 2);
    }
  }
  // Вставка под ручку
  if (getEnum(data.config('handleInsert')?.value ?? '').includes(handleId)) {
    const insert = data.price('handleInsert');
    if (insert) {
      ds.add(
        '',
        element(insert),
        2 + (hConfig.lock ? toNumber(hConfig.lock.value) * 2 : 0)
      );
    }
  }
  if (handleId === 'Yalis') {
    addPrice(ds, data, 'fix410_G', 2);
  }

  addBackPlank(ds, data, setup, keys, handleId, lockType, lockColor);
  return { hasLock: Boolean(hp.lock) };
}

/** Ответная планка и саморезы к ней */
function addBackPlank(
  ds: EstimateBuilder,
  data: LegacyData,
  setup: DoorSetup,
  keys: DoorKeys,
  handleId: string,
  lockType: string,
  lockColor: string
): void {
  const isKrona = lockType === 'krona';
  const plank = keys.doorPartConfig[`plankProfile-${lockType}`];
  const screwKey = isKrona ? 'screwPlankKrona' : 'screwPlank';
  let screw = data.configFirst({
    id: isKrona ? setup.doorCoverSku : lockColor,
    key: screwKey,
  });

  if (!isKrona) {
    const byHandle = data.configFirst({ key: 'plankByHandleId', id: handleId })?.value;
    const row = byHandle
      ? data.price(String(byHandle))
      : data.priceByParam({ type: String(plank?.param1 ?? ''), param1: lockColor })[0];
    if (!row) {
      return;
    }
    ds.add(
      '',
      element(row, { role: 'backPlank' }),
      plank?.value === undefined ? 1 : toNumber(plank.value)
    );
  }
  screw ??= data.configFirst({ key: screwKey, id: 'other' });
  addPrice(ds, data, String(screw?.value ?? ''), 2);
}
