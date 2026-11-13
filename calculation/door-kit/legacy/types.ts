/** Строки прайса и конфигурации легаси в том виде, как их видит калькулятор */

export type PriceRow = {
  id: string;
  type?: string;
  group?: string;
  name: string;
  image?: string;
  param1?: string;
  param2?: string;
  param3?: string;
  param4?: string;
  param5?: string;
  param6?: string;
  height?: number;
  width?: number;
  weight?: number;
  unit?: string;
  priceIn?: number;
  priceEUR?: number;
  /** Ключ строки в справочнике (id или id + индекс для дублей) */
  key: string;
};

export type ConfigRow = {
  id: string;
  key?: string;
  type?: string;
  value?: string | number;
  source?: string;
  [param: string]: string | number | undefined;
};

export type LegacyEntry<T> = { key: string; row: T };
