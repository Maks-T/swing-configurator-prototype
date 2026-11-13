import { afterEach, expect, test } from 'vitest';

import {
  PriceFormatter,
  applyBootstrapCurrency,
  priceFormatConfig,
  priceFormatter,
} from './price-formatter';

afterEach(() => {
  applyBootstrapCurrency('руб.');
});

test('priceFormatConfig uses ru locale and RUB currency', () => {
  expect(priceFormatConfig.locale).toBe('ru');
  expect(priceFormatConfig.options).toEqual({
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 1,
  });
});

test('format replaces ruble sign with currency symbol', () => {
  const formatter = new PriceFormatter(
    priceFormatConfig.locale,
    priceFormatConfig.options
  );

  applyBootstrapCurrency('Br');

  expect(formatter.format(100)).toContain('Br');
  expect(formatter.format(100)).not.toContain('₽');
});

test('applyBootstrapCurrency updates shared formatter symbol', () => {
  applyBootstrapCurrency('руб.');

  expect(priceFormatter.currencySymbol).toBe('руб.');
});

test('format uses passed currency symbol without changing default', () => {
  expect(priceFormatter.format(100, 'USD')).toContain('USD');
  expect(priceFormatter.format(100, 'USD')).not.toContain('₽');
  expect(priceFormatter.currencySymbol).toBe('руб.');
  expect(priceFormatter.format(100)).toContain('руб.');
});
