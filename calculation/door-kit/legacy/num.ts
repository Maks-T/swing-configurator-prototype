/** Числовые помощники легаси (f.toNumber, ut.round, ut.getEnum, ut.getMultiByPercent) */

/** f.toNumber: строка с запятой → число, мусор → 0 */
export function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const n = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/** ut.round: отсечение через |0, как в легаси */
export function round(
  num: number,
  dec = 3,
  mode: 'round' | 'ceil' | 'floor' = 'round'
): number {
  const k = 10 ** dec;
  return (Math[mode](num * k) | 0) / k;
}

/** ut.getEnum: «a, b, c» → ['a', 'b', 'c'] */
export function getEnum(value: unknown): string[] {
  return String(value ?? '')
    .split(',')
    .map((v) => v.trim());
}

/** ut.getMultiByPercent: 5 → 1.05 */
export function multiByPercent(percent: unknown): number {
  return 1 + toNumber(percent) / 100;
}

/** ut.getMinMax: «400-800» → { min: 400, max: 800 } */
export function getMinMax(value: unknown): { min: number; max: number } {
  const parts = value ? String(value).split(/\D/).map(Number) : [0];
  return { min: Math.min(...parts), max: Math.max(...parts) };
}
