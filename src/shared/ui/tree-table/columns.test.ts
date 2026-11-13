import { describe, expect, test } from 'vitest';

import { treeTableGridTemplate, visibleColumns } from './columns';

import type { TreeTableColumn } from './tree-table-types';

const columns: TreeTableColumn<{ name: string }>[] = [
  {
    id: 'name',
    header: 'Наименование',
    width: 'minmax(0, 1fr)',
    cell: (node) => node.data.name,
  },
  {
    id: 'count',
    header: 'Кол-во',
    width: '5rem',
    hidden: true,
    cell: () => null,
  },
  {
    id: 'length',
    header: 'Длина',
    cell: () => null,
  },
];

describe('tree table columns', () => {
  test('drops hidden columns', () => {
    expect(visibleColumns(columns).map((column) => column.id)).toEqual([
      'name',
      'length',
    ]);
  });

  test('builds grid template with expander and column widths', () => {
    expect(treeTableGridTemplate(columns)).toBe(
      'minmax(2.5rem, auto) minmax(0, 1fr) minmax(0, 1fr)'
    );
  });
});
