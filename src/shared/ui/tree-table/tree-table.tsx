import { useMemo, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { treeTableGridTemplate, visibleColumns } from './columns';
import { filterTree } from './filter-tree';
import { TreeTableNode } from './tree-table-node';

import type {
  TreeTableColumn,
  TreeTableNode as TreeTableNodeModel,
} from './tree-table-types';

const TREE_TABLE_ROW_CLASS =
  'calc:grid calc:w-full calc:h-8 calc:overflow-hidden calc:border-b-0 calc:leading-8';

export type TreeTableProps<T> = {
  columns: TreeTableColumn<T>[];
  data: TreeTableNodeModel<T>[];
  isGroup?: (node: TreeTableNodeModel<T>) => boolean;
  isZero?: (node: TreeTableNodeModel<T>) => boolean;
  showZeroItems?: boolean;
  showEmptyGroups?: boolean;
  defaultOpen?: boolean;
  maxHeight?: string | number;
  empty?: ReactNode;
  className?: string;
  rowClassName?: string;
  getRowClassName?: (node: TreeTableNodeModel<T>) => string | undefined;
};

function defaultIsGroup<T>(node: TreeTableNodeModel<T>) {
  return (node.children?.length ?? 0) > 0;
}

function defaultIsZero() {
  return false;
}

export function TreeTable<T>({
  columns,
  data,
  isGroup = defaultIsGroup,
  isZero = defaultIsZero,
  showZeroItems = false,
  showEmptyGroups = false,
  defaultOpen = true,
  maxHeight,
  empty,
  className,
  rowClassName,
  getRowClassName,
}: TreeTableProps<T>) {
  const baseRowClassName = cn(TREE_TABLE_ROW_CLASS, rowClassName);
  const tree = useMemo(
    () =>
      filterTree(
        data,
        {
          getChildren: (node) => node.children ?? [],
          withChildren: (node, children) => ({ ...node, children }),
          isGroup,
          isZero,
        },
        { showZeroItems, showEmptyGroups }
      ),
    [data, isGroup, isZero, showEmptyGroups, showZeroItems]
  );

  const visible = visibleColumns(columns);
  const rowStyle: CSSProperties = { gridTemplateColumns: treeTableGridTemplate(columns) };

  if (tree.length === 0) {
    return empty ?? null;
  }

  const header = (
    <table className="calc:w-full calc:caption-bottom calc:text-sm">
      <TableHeader className="calc:bg-muted-foreground/20">
        <TableRow className={baseRowClassName} style={rowStyle}>
          <TableHead />
          {visible.map((column) => (
            <TableHead key={column.id} className={column.headerClassName}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    </table>
  );

  const body = (
    <table className="calc:w-full calc:caption-bottom calc:text-sm">
      {tree.map((node) => (
        <TreeTableNode
          key={node.id}
          node={node}
          columns={columns}
          rowClassName={baseRowClassName}
          rowStyle={rowStyle}
          defaultOpen={defaultOpen}
          isGroup={isGroup}
          getRowClassName={getRowClassName}
        />
      ))}
    </table>
  );

  return (
    <div
      className={cn(
        'calc:overflow-hidden calc:rounded-lg calc:border calc:border-border calc:bg-card calc:shadow-sm calc:[&_td,_th]:pl-0',
        maxHeight !== undefined &&
          'calc:grid calc:min-h-0 calc:grid-rows-[auto_minmax(0,1fr)]',
        className
      )}
      style={maxHeight === undefined ? undefined : { maxHeight }}
    >
      <div className="calc:shrink-0">{header}</div>
      {maxHeight === undefined ? (
        body
      ) : (
        <ScrollArea className="calc:h-full calc:min-h-0 calc:[&_[data-slot=scroll-area-viewport]]:overflow-x-hidden">
          {body}
        </ScrollArea>
      )}
    </div>
  );
}
