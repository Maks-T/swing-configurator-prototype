import type { ConfigRow, LegacyEntry, PriceRow } from './types';

type Query = Record<string, string | number | undefined>;

const matches = (row: Record<string, unknown>, query: Query): boolean =>
  Object.entries(query).every(([k, v]) => row[k] === v);

/**
 * Доступ к прайсу и конфигурации как в легаси (store/List.ts):
 * price(id), getByParam, getFilter, getByMatrix. Порядок записей и
 * правила ключей сохранены, поэтому формулы переносятся 1:1.
 */
export class LegacyData {
  private readonly prices = new Map<string, PriceRow>();
  private readonly configs = new Map<string, ConfigRow>();

  constructor(
    prices: readonly LegacyEntry<PriceRow>[],
    configs: readonly LegacyEntry<ConfigRow>[]
  ) {
    for (const { key, row } of prices) {
      this.prices.set(key, { ...row, key });
    }
    for (const { key, row } of configs) {
      this.configs.set(key, row);
    }
  }

  /** window.price(id): копия строки прайса или undefined */
  price(id: string | undefined): PriceRow | undefined {
    if (!id) {
      return undefined;
    }
    const row = this.prices.get(id);
    return row ? { ...row } : undefined;
  }

  /** price.getByParam: все строки прайса, точно совпадающие по полям */
  priceByParam(query: Query): PriceRow[] {
    const out: PriceRow[] = [];
    for (const row of this.prices.values()) {
      if (matches(row, query)) {
        out.push({ ...row });
      }
    }
    return out;
  }

  /** window.config(id) */
  config(id: string): ConfigRow | undefined {
    return this.configs.get(id);
  }

  /** config.getByParam */
  configByParam(query: Query): ConfigRow[] {
    const out: ConfigRow[] = [];
    for (const row of this.configs.values()) {
      if (matches(row, query)) {
        out.push(row);
      }
    }
    return out;
  }

  configFirst(query: Query): ConfigRow | undefined {
    for (const row of this.configs.values()) {
      if (matches(row, query)) {
        return row;
      }
    }
    return undefined;
  }

  /**
   * config.getFilter(needle, 'key'): строки, ключ которых содержит needle
   * (без учёта регистра), по полю key. Повтор ключа — побеждает последний.
   */
  part(needle: string): Record<string, ConfigRow> {
    const lower = needle.toLowerCase();
    const out: Record<string, ConfigRow> = {};
    for (const [mapKey, row] of this.configs) {
      if (mapKey.toLowerCase().includes(lower)) {
        out[String(row.key)] = row;
      }
    }
    return out;
  }

  /** config.getByMatrix(query, 'value', filter, 'id') */
  matrix(query: Query, filter: Query = {}): Record<string, ConfigRow | undefined> {
    const first = this.configFirst(query);
    if (!first?.value) {
      return {};
    }
    const out: Record<string, ConfigRow | undefined> = {};
    for (const link of String(first.value).split(',')) {
      const id = link.trim();
      out[id] = this.configFirst({ id, ...filter });
    }
    return out;
  }

  /** Все строки прайса (для каталогов UI) */
  allPrices(): PriceRow[] {
    return [...this.prices.values()];
  }
}
