import type { TreeTableColumn } from './tree-table-types';

export const TREE_TABLE_EXPANDER_TRACK = 'minmax(2.5rem, auto)';

export function visibleColumns<T>(columns: TreeTableColumn<T>[]): TreeTableColumn<T>[] {
  return columns.filter((column) => !column.hidden);
}

export function treeTableGridTemplate<T>(columns: TreeTableColumn<T>[]): string {
  const tracks = [
    TREE_TABLE_EXPANDER_TRACK,
    ...visibleColumns(columns).map((column) => column.width ?? 'minmax(0, 1fr)'),
  ];

  return tracks.join(' ');
}
