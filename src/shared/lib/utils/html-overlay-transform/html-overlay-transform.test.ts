import { expect, test } from 'vitest';

import { htmlOverlayTransform } from './html-overlay-transform';

const BASE_PX = 192;

function attrs(scale: number, rotation = 15) {
  return { x: 10, y: 20, scaleX: scale, scaleY: scale, rotation, skewX: 0, skewY: 0 };
}

test('keeps canvas zoom when screen size is in range', () => {
  const scale = 0.2;

  expect(
    htmlOverlayTransform(attrs(scale), { baseSizePx: BASE_PX, minPx: 20, maxPx: 70 })
  ).toMatchObject({ scaleX: scale, scaleY: scale });
});

test('clamps below min screen size', () => {
  expect(
    htmlOverlayTransform(attrs(0.01), { baseSizePx: BASE_PX, minPx: 20, maxPx: 70 })
      .scaleX
  ).toBe(20 / BASE_PX);
});

test('clamps above max screen size', () => {
  expect(
    htmlOverlayTransform(attrs(1), { baseSizePx: BASE_PX, minPx: 20, maxPx: 70 }).scaleX
  ).toBe(70 / BASE_PX);
});

test('zoom false locks scale to 1', () => {
  expect(htmlOverlayTransform(attrs(0.4), { zoom: false })).toMatchObject({
    scaleX: 1,
    scaleY: 1,
  });
});

test('zoom false still clamps when max is below css size', () => {
  expect(
    htmlOverlayTransform(attrs(0.4), {
      zoom: false,
      baseSizePx: BASE_PX,
      maxPx: 70,
    }).scaleX
  ).toBe(70 / BASE_PX);
});

test('rotate false resets rotation', () => {
  expect(
    htmlOverlayTransform(attrs(1, 45), { rotate: false, zoom: false }).rotation
  ).toBe(0);
});
