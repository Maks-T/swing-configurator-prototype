import { multiByPercent, round } from '../legacy/num';

/** Элемент, добавляемый в смету (строка прайса + служебные поля) */
export type EstimateElement = {
  id?: string;
  name: string;
  unit?: string;
  /** Розница, EUR (priceEUR) */
  priceEUR?: number;
  /** Себестоимость (priceIn) */
  priceIn?: number;
  weight?: number;
  /** Наценка позиции, % (наценка за нестандарт, размеры вставки) */
  margin?: number;
  /** Наценка менеджера, % (у групп) */
  customMargin?: number;
  /** Скидка менеджера, % (у групп) */
  customDiscount?: number;
  /** Тип для поиска/отчётов (hinge, handle, decor…) */
  role?: string;
  sku?: string;
};

/** Итоги узла как в легаси (округление до целых на каждом узле) */
export type EstimateTotal = {
  /** Себестоимость */
  base: number;
  /** Розница без наценок */
  retail: number;
  /** С наценками, до скидки */
  oldPrice: number;
  /** Итог */
  price: number;
};

/** Узел дерева сметы */
export type EstimateNode = {
  id: string;
  name: string;
  prefix: string;
  unit: string;
  qty: number;
  sku?: string;
  role?: string;
  /** Розница за единицу */
  price: number;
  /** Себестоимость за единицу */
  cost: number;
  /** Наценка позиции, % (для показа «0%» как в легаси) */
  marginPercent: number;
  total: EstimateTotal;
  weight: number;
  isPlaceholder?: boolean;
  children: EstimateNode[];
};

const ZERO: EstimateTotal = { base: 0, retail: 0, oldPrice: 0, price: 0 };

/**
 * Смета как store/Estimate.js легаси: позиции с количеством (округление 0.001),
 * цена = priceEUR × наценка дилера, итоги округляются до целых на каждом узле,
 * наценка/скидка менеджера применяются на уровне групп (короб, полотно).
 */
export class EstimateBuilder {
  readonly node: EstimateNode;
  private readonly margin: number;
  private readonly customMargin: number;
  private readonly customDiscount: number;
  private readonly dealerMargin: number;
  private seq = 0;
  private readonly builders: EstimateBuilder[] = [];

  constructor(element: EstimateElement, count = 1, dealerMargin = 1, prefix = '') {
    this.dealerMargin = dealerMargin;
    this.margin = multiByPercent(element.margin ?? 0);
    this.customMargin = round(1 + (element.customMargin ?? 0) / 100, 2);
    this.customDiscount = round(1 - (element.customDiscount ?? 0) / 100, 2);
    this.node = {
      id: element.id ?? 'root',
      name: element.name,
      prefix,
      unit: element.unit ?? '',
      qty: round(count, 3),
      ...(element.sku ? { sku: element.sku } : {}),
      ...(element.role ? { role: element.role } : {}),
      price: round((element.priceEUR ?? 0) * dealerMargin, 3),
      cost: element.priceIn ?? 0,
      marginPercent: element.margin ?? 0,
      total: ZERO,
      weight: element.weight ?? 0,
      children: [],
    };
  }

  /** estimate.addItem(prefix, element, count) */
  add(prefix: string, element: EstimateElement, count = 1): EstimateBuilder {
    this.seq += 1;
    const child = new EstimateBuilder(
      {
        ...element,
        id: `${this.node.id}/${element.id ?? element.sku ?? 'item'}-${this.seq}`,
      },
      count,
      this.dealerMargin,
      prefix
    );
    this.builders.push(child);
    return child;
  }

  /** Позиция без строки прайса: видна в смете с нулевой ценой */
  addMissing(prefix: string, sku: string, count = 1): EstimateBuilder {
    const child = this.add(
      prefix,
      { name: `${sku} (нет в прайсе)`, sku, unit: 'шт' },
      count
    );
    child.node.isPlaceholder = true;
    return child;
  }

  /** estimate.calc(): рекурсивный пересчёт итогов */
  calc(): EstimateNode {
    const children = this.builders.map((b) => b.calc());
    let total: EstimateTotal;

    if (children.length > 0) {
      const sum = children.reduce(
        (acc, c) => ({
          base: acc.base + c.total.base,
          retail: acc.retail + c.total.retail,
          oldPrice: acc.oldPrice + c.total.oldPrice,
          price: acc.price + c.total.price,
        }),
        ZERO
      );
      total = {
        base: round(sum.base, 3),
        retail: round(sum.retail, 0),
        oldPrice: round(sum.oldPrice * this.customMargin, 0),
        price: round(sum.price * this.customMargin * this.customDiscount, 0),
      };
    } else {
      const retail = this.node.price * this.node.qty;
      const oldPrice = retail * this.margin * this.customMargin;
      total = {
        base: round(this.node.cost * this.node.qty, 3),
        retail: round(retail, 0),
        oldPrice: round(oldPrice, 0),
        price: round(oldPrice * this.customDiscount, 0),
      };
    }

    const weight =
      children.length > 0 ? children.reduce((a, c) => a + c.weight, 0) : this.node.weight;
    Object.assign(this.node, { total, children, weight });
    return this.node;
  }
}

/** Плоский список листьев сметы (для тестов и раскроя) */
export function flattenEstimate(node: EstimateNode): EstimateNode[] {
  return node.children.length === 0 ? [node] : node.children.flatMap(flattenEstimate);
}
