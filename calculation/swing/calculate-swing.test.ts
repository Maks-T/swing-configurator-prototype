import { describe, expect, it } from 'vitest';

import type { DoorSetup } from '../door-kit';

import { TEST_DATA } from './__fixtures__/data';
import {
  SCREENSHOT_DOOR,
  SCREENSHOT_FRAME,
  SCREENSHOT_TOTALS,
} from './__fixtures__/legacy-screenshot';
import { calculateSwing } from './calculate-swing';

/** Контрольный пример со скриншота легаси: Standart 51 + TECHNOFORM, 900×2060 */
const EXAMPLE: DoorSetup = {
  kind: 'swing',
  opening: { width: 900, height: 2060, depth: 80, floorGap: 10 },
  openSide: 'right-outside',
  frameVariant: 'withJumper',
  frame: 'standart51',
  door: 'technoform40',
  isNoDoor: false,
  hingeSku: 'hinge3D1',
  isHingeIncut: false,
  frameCoverSku: 'blackMate',
  doorCoverSku: 'blackMate',
  inserts: {},
  handle: { handleSku: null },
  margin: 0,
  discount: 0,
};

describe('swing golden: legacy screenshot 900×2060', () => {
  it('sizes: frame 872×2046, leaf 800×2000, 2 hinges', () => {
    const r = calculateSwing(EXAMPLE, TEST_DATA);
    expect([r.sizes.frameWidth, r.sizes.frameHeight]).toEqual([872, 2046]);
    expect(r.sizes.doors[0]).toMatchObject({ width: 800, height: 2000, baseSize: true });
    expect(r.hingeCount).toBe(2);
    expect(r.sizeIssues).toEqual([]);
  });
});

describe('swing golden: legacy specification rows', () => {
  const r = calculateSwing(EXAMPLE, TEST_DATA);
  const [frame, door] = r.estimate.children;
  const rows = (node: typeof frame) =>
    (node?.children ?? []).map((i) => [
      `${i.prefix ? `${i.prefix} ` : ''}${i.name}`.replace(': ', ':').replace(':', ': '),
      i.qty,
      i.total.base,
      i.total.price,
    ]);

  it('frame group matches legacy row by row', () => {
    expect(rows(frame).map(normalize)).toEqual(SCREENSHOT_FRAME.map(normalize));
  });

  it('door group matches legacy row by row', () => {
    expect(rows(door).map(normalize)).toEqual(SCREENSHOT_DOOR.map(normalize));
  });

  it('totals 393 + 275 = 668 EUR, cost 90.035 + 71.525', () => {
    expect(frame?.total.price).toBe(SCREENSHOT_TOTALS.frame);
    expect(door?.total.price).toBe(SCREENSHOT_TOTALS.door);
    expect(r.totals.final).toBe(SCREENSHOT_TOTALS.total);
    expect(frame?.total.base).toBeCloseTo(SCREENSHOT_TOTALS.frameCost, 3);
    expect(door?.total.base).toBeCloseTo(SCREENSHOT_TOTALS.doorCost, 3);
  });
});

/** Сравнение без пробелов вокруг двоеточия и с точностью до 0.001 */
function normalize(row: readonly (string | number)[]): (string | number)[] {
  return row.map((v) =>
    typeof v === 'number'
      ? Math.round(v * 1000) / 1000
      : v.replaceAll(/\s*:\s*/g, ': ').trim()
  );
}
