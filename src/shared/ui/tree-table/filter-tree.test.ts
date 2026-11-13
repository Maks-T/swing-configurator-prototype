import { describe, expect, test } from 'vitest';

import { filterTree } from './filter-tree';

import type { TreeTableNode } from './tree-table-types';

type Item = {
  name: string;
  count: number;
  kind: 'group' | 'leaf';
};

function node(
  id: string,
  item: Item,
  children: TreeTableNode<Item>[] = []
): TreeTableNode<Item> {
  return { id, data: item, children };
}

const accessors = {
  getChildren: (n: TreeTableNode<Item>) => n.children ?? [],
  withChildren: (n: TreeTableNode<Item>, children: TreeTableNode<Item>[]) => ({
    ...n,
    children,
  }),
  isGroup: (n: TreeTableNode<Item>) => n.data.kind === 'group',
  isZero: (n: TreeTableNode<Item>) => n.data.count === 0,
};

const terrace = node('terrace', { name: 'Терраса', count: 1, kind: 'group' }, [
  node('decking', { name: 'Настил', count: 1, kind: 'group' }, [
    node('board-1', { name: 'Доска', count: 2, kind: 'leaf' }),
  ]),
]);

const emptyGroups = node('terrace', { name: 'Терраса', count: 1, kind: 'group' }, [
  node('decking', { name: 'Настил', count: 1, kind: 'group' }),
]);

describe('filterTree', () => {
  test('hides empty groups when showEmptyGroups is false', () => {
    expect(
      filterTree([emptyGroups], accessors, {
        showZeroItems: false,
        showEmptyGroups: false,
      })
    ).toEqual([]);
  });

  test('keeps empty groups when showEmptyGroups is true', () => {
    const tree = filterTree([emptyGroups], accessors, {
      showZeroItems: false,
      showEmptyGroups: true,
    });

    expect(tree).toHaveLength(1);
    expect(tree[0]?.children).toHaveLength(1);
  });

  test('hides zero leaves unless enabled', () => {
    const withZero = node('terrace', { name: 'Терраса', count: 1, kind: 'group' }, [
      node('decking', { name: 'Настил', count: 1, kind: 'group' }, [
        node('board-1', { name: 'Доска', count: 0, kind: 'leaf' }),
      ]),
    ]);

    const hidden = filterTree([withZero], accessors, {
      showZeroItems: false,
      showEmptyGroups: false,
    });
    const visible = filterTree([withZero], accessors, {
      showZeroItems: true,
      showEmptyGroups: false,
    });

    expect(hidden).toEqual([]);
    expect(visible[0]?.children?.[0]?.children?.[0]?.id).toBe('board-1');
  });

  test('keeps nested groups and leaves when nothing is hidden', () => {
    const tree = filterTree([terrace], accessors, {
      showZeroItems: false,
      showEmptyGroups: false,
    });

    expect(tree[0]?.id).toBe('terrace');
    expect(tree[0]?.children?.[0]?.id).toBe('decking');
    expect(tree[0]?.children?.[0]?.children?.[0]?.id).toBe('board-1');
  });

  test('filters zeros at any nesting depth', () => {
    const deep = node('a', { name: 'A', count: 1, kind: 'group' }, [
      node('b', { name: 'B', count: 1, kind: 'group' }, [
        node('c', { name: 'C', count: 1, kind: 'group' }, [
          node('leaf', { name: 'L', count: 0, kind: 'leaf' }),
        ]),
      ]),
    ]);

    expect(
      filterTree([deep], accessors, {
        showZeroItems: false,
        showEmptyGroups: false,
      })
    ).toEqual([]);
  });
});
