import { expect, test } from 'vitest';

import { formatMoney, formatQty } from './format-money';

test('formats euro with two decimals', () => {
  expect(formatMoney(1234.5).replace(/\s/g, ' ')).toBe('1 234,50 €');
});

test('formats quantity without trailing zeros', () => {
  expect(formatQty(2.5)).toBe('2,5');
  expect(formatQty(7.1339)).toBe('7,134');
});
