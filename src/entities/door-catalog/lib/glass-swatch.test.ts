import { describe, expect, it } from 'vitest';

import { getGlassSwatch } from './glass-swatch';

import type { PriceRow } from '@calculation/door-kit';

const glass = (name: string): PriceRow => ({
  id: 'g',
  key: 'g',
  type: 'glass',
  name,
  unit: 'м2',
});

describe('getGlassSwatch', () => {
  it.each([
    ['Trasparente 4 мм', 'clear'],
    ['Satinato Bronzo 4 мм', 'satin'],
    ['Mirror Grey', 'mirror'],
    ['TRIPLEX Grafite с черной сеткой', 'mesh'],
    ['Line 01 Clearvision 4мм', 'ribbed'],
    ['Colour matt.TRIPLEX08', 'satin'],
    ['Colour 12', 'solid'],
    ['Colour TRIPLEX RAL', 'palette'],
  ])('%s → %s', (name, pattern) => {
    expect(getGlassSwatch(glass(name)).pattern).toBe(pattern);
  });

  it('maps colour numbers to the palette', () => {
    expect(getGlassSwatch(glass('Colour TRIPLEX08')).color).toBe('#256176');
  });

  it('falls back for unknown product', () => {
    expect(getGlassSwatch(undefined).pattern).toBe('clear');
  });
});
