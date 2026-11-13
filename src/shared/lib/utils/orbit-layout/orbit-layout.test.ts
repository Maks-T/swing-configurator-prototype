import { expect, test } from 'vitest';

import { getOrbitItemOffsets } from './orbit-layout';

const RADIUS = 10;
const RIGHT: Point = { x: 1, y: 0 };
const UP: Point = { x: 0, y: -1 };

test('returns an empty array when there are no items', () => {
  expect(
    getOrbitItemOffsets({
      count: 0,
      maxItems: 8,
      radius: RADIUS,
      direction: RIGHT,
    })
  ).toEqual([]);
});

test('returns an empty array when maxItems is 0', () => {
  expect(
    getOrbitItemOffsets({
      count: 3,
      maxItems: 0,
      radius: RADIUS,
      direction: RIGHT,
    })
  ).toEqual([]);
});

test('places a single item on the direction at the given radius', () => {
  const [offset] = getOrbitItemOffsets({
    count: 1,
    maxItems: 8,
    radius: RADIUS,
    direction: UP,
  });

  expect(offset?.x).toBeCloseTo(0);
  expect(offset?.y).toBeCloseTo(-RADIUS);
});

test('uses fallback up direction when the vector is zero', () => {
  const [offset] = getOrbitItemOffsets({
    count: 1,
    maxItems: 8,
    radius: RADIUS,
    direction: { x: 0, y: 0 },
  });

  expect(offset?.x).toBeCloseTo(0);
  expect(offset?.y).toBeCloseTo(-RADIUS);
});

test('ignores direction magnitude and still uses unit radius', () => {
  const [offset] = getOrbitItemOffsets({
    count: 1,
    maxItems: 8,
    radius: RADIUS,
    direction: { x: 0, y: -4 },
  });

  expect(offset?.x).toBeCloseTo(0);
  expect(offset?.y).toBeCloseTo(-RADIUS);
});

test('starts filling on direction', () => {
  const offsets = getOrbitItemOffsets({
    count: 4,
    maxItems: 8,
    radius: RADIUS,
    direction: RIGHT,
  });

  expect(offsets).toHaveLength(4);
  expect(offsets[0]?.x).toBeCloseTo(RADIUS);
  expect(offsets[0]?.y).toBeCloseTo(0);
});

test('fills remaining slots clockwise from direction using maxItems step', () => {
  const offsets = getOrbitItemOffsets({
    count: 2,
    maxItems: 8,
    radius: RADIUS,
    direction: UP,
  });

  expect(offsets[0]?.x).toBeCloseTo(0);
  expect(offsets[0]?.y).toBeCloseTo(-RADIUS);
  expect(offsets[1]?.x).toBeCloseTo(RADIUS * Math.cos(-Math.PI / 4));
  expect(offsets[1]?.y).toBeCloseTo(RADIUS * Math.sin(-Math.PI / 4));
});

test('applies startOffset from direction before clockwise filling', () => {
  const startOffset = -45;
  const offsets = getOrbitItemOffsets({
    count: 2,
    maxItems: 8,
    radius: RADIUS,
    direction: UP,
    startOffset,
  });
  const firstAngle = -Math.PI / 2 + (startOffset * Math.PI) / 180;

  expect(offsets[0]?.x).toBeCloseTo(RADIUS * Math.cos(firstAngle));
  expect(offsets[0]?.y).toBeCloseTo(RADIUS * Math.sin(firstAngle));
  expect(offsets[1]?.x).toBeCloseTo(0);
  expect(offsets[1]?.y).toBeCloseTo(-RADIUS);
});

test('keeps clockwise order around the full circle when all slots are filled', () => {
  const offsets = getOrbitItemOffsets({
    count: 4,
    maxItems: 4,
    radius: RADIUS,
    direction: RIGHT,
  });

  expect(offsets[0]?.x).toBeCloseTo(RADIUS);
  expect(offsets[0]?.y).toBeCloseTo(0);
  expect(offsets[1]?.x).toBeCloseTo(0);
  expect(offsets[1]?.y).toBeCloseTo(RADIUS);
  expect(offsets[2]?.x).toBeCloseTo(-RADIUS);
  expect(offsets[2]?.y).toBeCloseTo(0);
  expect(offsets[3]?.x).toBeCloseTo(0);
  expect(offsets[3]?.y).toBeCloseTo(-RADIUS);
});

test('does not render more positions than maxItems', () => {
  expect(
    getOrbitItemOffsets({
      count: 10,
      maxItems: 3,
      radius: RADIUS,
      direction: RIGHT,
    })
  ).toHaveLength(3);
});
