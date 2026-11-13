import { describe, expect, it } from 'vitest';

import { EXAMPLE_SETUP, TEST_DATA } from '@calculation/door-kit/__fixtures__/data';
import { calculateSwing } from '@calculation/swing';

import { buildDoorDrawings, DRAWING_SHEETS } from './build-drawings';

describe('door drawings', () => {
  it('builds all sheets with entities', () => {
    const result = calculateSwing(EXAMPLE_SETUP, TEST_DATA);
    const doc = buildDoorDrawings(EXAMPLE_SETUP, result, TEST_DATA);
    const json = JSON.stringify(doc.toJSON());
    DRAWING_SHEETS.forEach((sheet) => {
      expect(json).toContain(sheet.title);
    });
  });
});
