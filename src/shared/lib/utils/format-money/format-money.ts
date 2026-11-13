const FORMATTERS = new Map<string, Intl.NumberFormat>();

/** Сумма в валюте прототипа (EUR по умолчанию), 2 знака */
export function formatMoney(value: number, currency = 'EUR'): string {
  let formatter = FORMATTERS.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    FORMATTERS.set(currency, formatter);
  }
  return formatter.format(value);
}

/** Количество: до 3 знаков без хвостовых нулей */
export function formatQty(value: number): string {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 3 }).format(value);
}
