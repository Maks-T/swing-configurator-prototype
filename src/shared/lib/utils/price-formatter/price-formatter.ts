export const priceFormatConfig: {
  locale: string | string[];
  options: Intl.NumberFormatOptions;
} = {
  locale: 'ru',
  options: { style: 'currency', currency: 'RUB', maximumFractionDigits: 1 },
};

let currencySymbol = 'руб.';

export class PriceFormatter extends Intl.NumberFormat {
  set currencySymbol(symbol: string) {
    if (typeof symbol !== 'string') {
      return;
    }

    currencySymbol = symbol;
  }

  get currencySymbol(): string {
    return currencySymbol;
  }

  override format(value: number | bigint, symbol = currencySymbol): string {
    return super.format(value).replace('₽', symbol);
  }
}

export const priceFormatter = new PriceFormatter(
  priceFormatConfig.locale,
  priceFormatConfig.options
);

export function applyBootstrapCurrency(symbolNative: string) {
  priceFormatter.currencySymbol = symbolNative;
}

export function getPriceLabel(value: number): string {
  return value > 0 ? priceFormatter.format(value) : 'Бесплатно';
}
