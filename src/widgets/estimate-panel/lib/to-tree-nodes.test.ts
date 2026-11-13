import { describe, expect, it } from 'vitest';

import { collectPlaceholders, toTreeNodes } from './to-tree-nodes';

import type { EstimateNode } from '@calculation/door-kit';

const node = (patch: Partial<EstimateNode>): EstimateNode => ({
  id: 'x',
  name: 'x',
  prefix: '',
  unit: 'шт',
  qty: 1,
  price: 1,
  cost: 1,
  marginPercent: 0,
  total: { base: 1, retail: 1, oldPrice: 1, price: 1 },
  weight: 0,
  children: [],
  ...patch,
});

describe('toTreeNodes', () => {
  it('makes unique path ids for repeated skus', () => {
    const tree = toTreeNodes([node({ children: [node({}), node({})] })]);
    expect(tree[0]?.children?.map((c) => c.id)).toEqual(['0.0', '0.1']);
    expect(tree[0]?.children?.[0]?.children).toBeUndefined();
  });

  it('collects placeholders once', () => {
    const list = [
      node({
        children: [
          node({ name: 'p', isPlaceholder: true }),
          node({ name: 'p', isPlaceholder: true }),
        ],
      }),
    ];
    expect(collectPlaceholders(list)).toEqual(['p']);
  });
});
