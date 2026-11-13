import { describe, expect, it } from 'vitest';

import { EXAMPLE_SETUP, TEST_DATA } from '../__fixtures__/data';
import { getHingeCount } from '../frame/hinges';
import { resolveKeys, type DoorSetup } from '../setup';
import { calculateSwingSizes } from '../sizes';

import { buildFacadeGeometry, hingeCenters } from './facade-geometry';

describe('facade geometry', () => {
  const setup = EXAMPLE_SETUP;
  const calc = (s: DoorSetup) => {
    const sizes = calculateSwingSizes(TEST_DATA, s, resolveKeys(s, TEST_DATA));
    return {
      sizes,
      hingeCount: getHingeCount(TEST_DATA, sizes.doorWidthMax, sizes.doorHeight),
    };
  };
  const result = calc(setup);

  it('places hinges 250 mm from leaf ends', () => {
    expect(hingeCenters(10, 2000, 2)).toEqual([1760, 260]);
    expect(hingeCenters(0, 2000, 3)).toEqual([1750, 1000, 250]);
  });

  it('builds frame posts, jumper and centred leaf', () => {
    const g = buildFacadeGeometry(setup, result.sizes, result.hingeCount, 'outside');
    expect(g.frameBars).toHaveLength(3);
    expect(g.leaf).toMatchObject({
      width: 800,
      height: 2000,
      x: 50,
      y: 10,
      hingeSide: 'right',
    });
    expect(g.leaf?.hinges).toHaveLength(2);
  });

  it('mirrors hinge side and swing direction for the inside view', () => {
    const outside = buildFacadeGeometry(setup, result.sizes, 2, 'outside');
    const inside = buildFacadeGeometry(setup, result.sizes, 2, 'inside');
    expect(inside.leaf?.hingeSide).not.toBe(outside.leaf?.hingeSide);
    expect(inside.leaf?.isAway).toBe(!outside.leaf?.isAway);
  });

  it('has no frame bars without frame and no jumper without jumper', () => {
    const noJumper = { ...setup, frameVariant: 'noJumper' as const };
    const r = calc(noJumper);
    expect(buildFacadeGeometry(noJumper, r.sizes, 2, 'outside').frameBars).toHaveLength(
      2
    );
    const noFrame = { ...setup, frameVariant: 'noFrame' as const };
    expect(
      buildFacadeGeometry(noFrame, calc(noFrame).sizes, 2, 'outside').frame
    ).toBeNull();
  });
});
