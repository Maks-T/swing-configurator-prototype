import {
  EstimateBuilder,
  addInserts,
  addLeafPrice,
  addSwingHandle,
  calculateFrame,
  calculateFrameToDoor,
  calculateLeafFrame,
  calculateSwingSizes,
  checkLeafLimits,
  getHingeCount,
  resolveHandleParts,
  resolveInserts,
  resolveKeys,
  type DoorKeys,
  type DoorSetup,
  type DoorSizes,
  type EstimateNode,
  type HingeContext,
  type InsertPart,
  type LegacyData,
  type SizeIssue,
} from '../door-kit';

export type SwingTotals = {
  /** Себестоимость */
  cost: number;
  /** Розница без наценки/скидки менеджера */
  retail: number;
  /** Итог с наценкой и скидкой */
  final: number;
  currency: 'EUR';
};

export type SwingResult = {
  keys: DoorKeys;
  sizes: DoorSizes;
  limits: { minH: number; maxH: number; minW: number; maxW: number } | null;
  sizeIssues: SizeIssue[];
  inserts: InsertPart[];
  hingeCount: number;
  estimate: EstimateNode;
  totals: SwingTotals;
  warnings: string[];
  isValid: boolean;
};

/**
 * Распашная одностворчатая дверь: размеры, короб, полотно, петли, ручка,
 * отделка, смета (calculator.calculate легаси для type = swing).
 */
export function calculateSwing(setup: DoorSetup, data: LegacyData): SwingResult {
  const keys = resolveKeys(setup, data);
  const sizes = calculateSwingSizes(data, setup, keys);
  const { issues: sizeIssues, limits } = checkLeafLimits(data, setup, keys, sizes);
  const warnings: string[] = [];
  const leaf = sizes.doors[0] ?? { width: 0, height: 0, perimeter: 0, baseSize: false };
  const { parts, issues: insertIssues } = resolveInserts(data, setup, keys, leaf);
  warnings.push(...insertIssues.map((i) => i.message));

  const hingeCount = getHingeCount(data, sizes.doorWidthMax, sizes.doorHeight);
  if (!hingeCount) {
    warnings.push('Число петель не найдено для размеров полотна');
  }
  const ctx: HingeContext = {
    data,
    setup,
    keys,
    sizes,
    doorCount: 1,
    hingeCount,
    warnings,
  };

  const root = new EstimateBuilder({ id: 'product', name: 'Дверь' });
  if (setup.frame) {
    calculateFrame(root, ctx);
  }

  if (!setup.isNoDoor && setup.door) {
    const doorName = String(data.config(setup.door)?.value ?? setup.door);
    const ds = root.add('Полотно №1', {
      id: 'door',
      name: `${doorName}: ${leaf.width}*${leaf.height} мм`,
      unit: 'шт',
      customMargin: setup.margin,
      customDiscount: setup.discount,
      role: 'door',
    });
    const leafCtx = { ...ctx, leaf, index: 0, parts };
    const handleParts = setup.handle.handleSku
      ? resolveHandleParts(data, setup, keys, setup.handle.handleSku)
      : null;

    addLeafPrice(ds, leafCtx);
    if (keys.isNoFrame) {
      calculateFrameToDoor(ds, ctx);
    }
    calculateLeafFrame(ds, leafCtx, Boolean(handleParts?.lock));
    addSwingHandle(ds, data, setup, keys, parts, warnings);
    addInserts(ds, data, keys, parts);
  }

  const estimate = root.calc();
  return {
    keys,
    sizes,
    limits,
    sizeIssues,
    inserts: parts,
    hingeCount,
    estimate,
    totals: {
      cost: estimate.total.base,
      retail: estimate.total.retail,
      final: estimate.total.price,
      currency: 'EUR',
    },
    warnings,
    isValid: sizeIssues.length === 0 && sizes.frameWidth > 0 && leaf.width > 0,
  };
}
