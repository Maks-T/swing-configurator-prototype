import { toNumber } from '../legacy/num';

import { addPrice, element } from '../estimate/elements';

import type { EstimateBuilder } from '../estimate/legacy-estimate';
import type { LegacyData } from '../legacy/legacy-data';
import type { ConfigRow } from '../legacy/types';
import type { DoorKeys, DoorSetup } from '../setup';
import type { DoorSizes } from '../sizes';

/** Контекст расчёта: данные, выбор менеджера, ключи, размеры, предупреждения */
export type HingeContext = {
  data: LegacyData;
  setup: DoorSetup;
  keys: DoorKeys;
  sizes: DoorSizes;
  doorCount: number;
  hingeCount: number;
  warnings: string[];
};

/** getCountHinge: число петель по таблице В×Ш (c_80, id = hingeCount) */
export function getHingeCount(
  data: LegacyData,
  widthMax: number,
  height: number,
  isBivalve = false
): number {
  const row = data.configByParam({ id: 'hingeCount' }).find((item) => {
    const [h0, h1] = String(item.param1 ?? '').split('-');
    const [w0, w1] = String(item.param2 ?? '').split('-');
    return (
      widthMax >= Number(w0) &&
      widthMax <= Number(w1) &&
      height >= Number(h0) &&
      height <= Number(h1)
    );
  });
  const count = toNumber(row?.value);
  return isBivalve ? count * 2 : count;
}

/** Винты петель: по группе из списания короба, иначе «frame» из списания полотна; плюс винты полотна */
function addHingeFix(fs: EstimateBuilder, ctx: HingeContext, count: number): void {
  const { data, keys } = ctx;
  const byGroup = data.configFirst({
    id: keys.framePart,
    key: 'hingeFixByGroup',
    param2: keys.hingeGroup,
  });
  const frameFix = data.configFirst({
    id: keys.doorPartKey,
    key: 'hingeFix',
    param2: 'frame',
  });
  const doorFix =
    data.configFirst({
      id: keys.doorPartKey,
      key: 'hingeFix',
      param2: keys.hingeGroup,
    }) ?? data.configFirst({ id: keys.doorPartKey, key: 'hingeFix', param2: 'door' });

  const add = (cfg: ConfigRow | undefined): void => {
    if (cfg) {
      addPrice(fs, data, String(cfg.param1 ?? ''), count * toNumber(cfg.value));
    }
  };
  add(byGroup);
  if (!byGroup) {
    add(frameFix);
  }
  add(doorFix);
}

/** addHinge легаси: петли (или врезка), винты, зарезка под петли в коробе */
export function addHinges(
  fs: EstimateBuilder,
  ctx: HingeContext,
  frameConfig: Record<string, ConfigRow>
): void {
  const { data, setup, keys } = ctx;
  let count = ctx.hingeCount;
  if (keys.isNoFrame) {
    count /= ctx.doorCount;
  }

  if ((keys.isNoFrame || setup.isNoDoor) && setup.isHingeIncut) {
    const incut = data.priceByParam({
      type: 'hingeIncut',
      group: data.price(setup.hingeSku)?.type,
    })[0];
    if (incut) {
      fs.add('', element(incut), count);
    }
    return;
  }

  const hinge = data.price(setup.hingeSku);
  if (hinge) {
    fs.add('', element(hinge, { role: 'hinge' }), count);
  } else {
    ctx.warnings.push('Петля не выбрана');
  }
  addHingeFix(fs, ctx, count);

  const cut = frameConfig.hingeCut;
  if (cut) {
    addPrice(fs, data, String(cut.param1 ?? ''), count * toNumber(cut.value));
  }
}
