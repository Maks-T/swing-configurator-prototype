import type { ReactNode } from 'react';

export type TreeTableNode<T> = {
  id: string;
  data: T;
  children?: TreeTableNode<T>[];
};

export type TreeTableCellContext = {
  depth: number;
  isGroup: boolean;
  isOpen: boolean;
};

export type TreeTableColumn<T> = {
  id: string;
  header?: ReactNode;
  width?: string;
  hidden?: boolean;
  className?: string;
  headerClassName?: string;
  cell: (node: TreeTableNode<T>, ctx: TreeTableCellContext) => ReactNode;
};
