import { describe, expect, it } from 'vitest';

import {
  SUPPORTED_FRAMES,
  flattenEstimate,
  getFrameOptions,
  getGlassOptions,
  getHandleOptions,
  getHingeGroups,
  getHinges,
  getLeafOptions,
  type DoorSetup,
} from '../door-kit';

import { TEST_DATA } from './__fixtures__/data';
import { calculateSwing } from './calculate-swing';

const base = (frame: string, door: string, hingeSku: string): DoorSetup => ({
  kind: 'swing',
  opening: { width: 900, height: 2100, depth: 80, floorGap: 10 },
  openSide: 'right-outside',
  frameVariant: 'withJumper',
  frame,
  door,
  isNoDoor: false,
  hingeSku,
  isHingeIncut: false,
  frameCoverSku: 'blackMate',
  doorCoverSku: 'blackMate',
  inserts: {},
  handle: { handleSku: null },
  margin: 0,
  discount: 0,
});

const combos = SUPPORTED_FRAMES.flatMap((frame) =>
  getLeafOptions(TEST_DATA, 'right-outside')
    .filter((leaf) => !leaf.disabled)
    .flatMap((leaf) => {
      const group = getHingeGroups(TEST_DATA, frame, leaf.id)[0];
      const hinge = group ? getHinges(TEST_DATA, group.id)[0] : undefined;
      return hinge ? [[frame, leaf.id, hinge.key] as const] : [];
    })
);

describe('swing smoke: every supported frame × leaf', () => {
  it('has combinations', () => {
    expect(combos.length).toBeGreaterThan(10);
  });

  it.each(combos)(
    '%s + %s (%s) calculates without missing prices',
    (frame, door, hinge) => {
      const r = calculateSwing(base(frame, door, hinge), TEST_DATA);
      const missing = flattenEstimate(r.estimate)
        .filter((i) => i.isPlaceholder)
        .map((i) => i.name);
      expect(missing).toEqual([]);
      expect(r.totals.final).toBeGreaterThan(0);
      expect(r.warnings).toEqual([]);
    }
  );
});

describe('swing variants', () => {
  it('no jumper: leaf from opening height', () => {
    const r = calculateSwing(
      { ...base('standart51', 'technoform40', 'hinge3D1'), frameVariant: 'noJumper' },
      TEST_DATA
    );
    expect(r.keys.frameJumper).toBe(false);
    expect(r.sizes.doors[0]?.height).toBe(2100 - 5 - 10);
  });

  it('no frame: hinges go into the leaf group, no frame group', () => {
    const r = calculateSwing(
      { ...base('standart51', 'technoform40', 'hinge3D1'), frameVariant: 'noFrame' },
      TEST_DATA
    );
    expect(r.estimate.children.map((c) => c.role)).toEqual(['door']);
    expect(flattenEstimate(r.estimate).some((i) => i.role === 'hinge')).toBe(true);
  });

  it('no door: only frame group, named for the leaf', () => {
    const r = calculateSwing(
      { ...base('standart51', 'technoform40', 'hinge3D1'), isNoDoor: true },
      TEST_DATA
    );
    expect(r.estimate.children.map((c) => c.role)).toEqual(['frame']);
    expect(r.estimate.children[0]?.name).toContain('под полотно');
  });

  it('size limits: leaf wider than 1100 is an issue', () => {
    const r = calculateSwing(
      {
        ...base('standart51', 'technoform40', 'hinge3D1'),
        opening: { width: 1400, height: 2100, depth: 80, floorGap: 10 },
      },
      TEST_DATA
    );
    expect(r.sizeIssues.map((i) => i.field)).toContain('width');
    expect(r.isValid).toBe(false);
  });

  it('manager margin and discount apply to groups', () => {
    const plain = calculateSwing(
      base('standart51', 'technoform40', 'hinge3D1'),
      TEST_DATA
    );
    const r = calculateSwing(
      { ...base('standart51', 'technoform40', 'hinge3D1'), margin: 10, discount: 5 },
      TEST_DATA
    );
    expect(r.totals.final).toBeGreaterThan(plain.totals.final);
    expect(r.totals.retail).toBe(plain.totals.retail);
  });

  it('glass insert adds decor rows with films and alcohol', () => {
    const glass = getGlassOptions(TEST_DATA, 'technoform40').find(
      (g) => g.param2 === '+'
    );
    expect(glass).toBeDefined();
    const r = calculateSwing(
      {
        ...base('standart51', 'technoform40', 'hinge3D1'),
        inserts: { front: { sku: glass?.key ?? '' }, back: { sku: glass?.key ?? '' } },
      },
      TEST_DATA
    );
    const rows = flattenEstimate(r.estimate);
    expect(rows.filter((i) => i.role === 'decor')).toHaveLength(2);
    expect(r.inserts[0]?.width).toBeLessThan(800);
    // прозрачное стекло: пенопласт внутрь полотна TF не кладём
    expect(rows.some((i) => i.name.startsWith('Пенопласт для полотна'))).toBe(false);
  });

  it('handle with lock adds lock, back plank and screws', () => {
    const handles = getHandleOptions(TEST_DATA, 'technoform40');
    const withLock = handles.find((h) =>
      calculateSwing(
        {
          ...base('standart51', 'technoform40', 'hinge3D1'),
          handle: { handleSku: h.key },
        },
        TEST_DATA
      ).estimate.children[1]?.children.some((c) => c.role === 'lock')
    );
    expect(withLock).toBeDefined();
  });

  it('frame options for swing contain supported frames', () => {
    const ids = getFrameOptions(TEST_DATA, 'swing', 'right-outside').map((f) => f.id);
    expect(ids).toEqual(
      expect.arrayContaining(['standart51', 'modula51', 'monoblock', 'monoblock-b'])
    );
  });
});
