export type OrbitLayoutOptions = {
  count: number;
  maxItems: number;
  radius: number;
  direction: Point;
  /** Начальное угловое смещение от direction в градусах. По часовой > 0. @default 0 */
  startOffset?: number;
};

const FALLBACK_DIRECTION: Point = { x: 0, y: -1 };

function resolveDirection(direction: Point): Point {
  if (direction.x === 0 && direction.y === 0) {
    return FALLBACK_DIRECTION;
  }

  return direction;
}

/** Смещения по окружности: direction + startOffset (градусы), дальше по часовой с шагом 360°/maxItems. */
export function getOrbitItemOffsets({
  count,
  maxItems,
  radius,
  direction,
  startOffset = 0,
}: OrbitLayoutOptions): Point[] {
  const itemCount = Math.min(count, maxItems);

  if (itemCount <= 0) {
    return [];
  }

  const resolved = resolveDirection(direction);
  const directionAngle = Math.atan2(resolved.y, resolved.x);
  const startOffsetRad = (startOffset * Math.PI) / 180;

  return Array.from({ length: itemCount }, (_, index) => {
    const angle = directionAngle + startOffsetRad + (2 * Math.PI * index) / maxItems;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}
