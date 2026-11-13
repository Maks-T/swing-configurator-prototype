/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface Window {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
}

/**
 * Числовые индексы кортежа / `as const` массива.
 * @example ArrayIndex<typeof items> // 0 | 1 | 2 при length === 3
 */
type ArrayIndex<T extends readonly unknown[]> = {
  [K in keyof T]: K extends `${infer N extends number}` ? N : never;
}[number];

/** Кортеж длины N из элементов T */
type TupleOfLength<T, N extends number, Acc extends T[] = []> = Acc['length'] extends N
  ? Acc
  : TupleOfLength<T, N, [...Acc, T]>;

type Point = {
  x: number;
  y: number;
};

/** Отрезок: две точки */
type Vector = [Point, Point];

type Polygon = Point[];

/** Массив полигонов; каждый полигон — массив точек */
type Polygons = Polygon[];
