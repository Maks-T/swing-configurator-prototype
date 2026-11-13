/**
 * calcProfile легаси: списание погонажа хлыстами. Если остаток хлыста меньше
 * делового — хлыст списывается целиком; если следующая деталь не влезает —
 * хлыст закрывается по факту. Результат в метрах.
 */
export function calcProfile(
  partsMm: readonly number[],
  valuable?: number,
  total?: number
): number {
  const parts = partsMm.map((p) => p / 1e3);
  const valuableProfile = valuable || 0.6;
  const totalProfile = total || 6;
  let pipe = 0;
  let count = 0;

  for (let i = 0; i < parts.length; i += 1) {
    count += parts[i] ?? 0;
    if (totalProfile - count < valuableProfile) {
      pipe += totalProfile;
      count = 0;
    }
    const next = parts[i + 1];
    if (next !== undefined && count + next > totalProfile) {
      pipe += count;
      count = 0;
    }
  }
  return pipe + count;
}

/** addElWeight: вес позиции (округление вверх) и подпись «(N кг)» в названии */
export function withWeight<T extends { name: string; weight?: number }>(
  element: T,
  count: number
): T {
  if (!element.weight) {
    return element;
  }
  const weight = Math.ceil(element.weight * count);
  return { ...element, weight, name: `${element.name} (${weight}кг)` };
}
