import { expect, test } from 'vitest';

import { formatInteger } from './integer-formatter';

test('formatInteger drops decimal digits', () => {
  expect(formatInteger(1234.9)).not.toMatch(/[.,]\d/);
});

test('formatInteger groups thousands with a space', () => {
  expect(formatInteger(40000)).toMatch(/40\s000/);
});
