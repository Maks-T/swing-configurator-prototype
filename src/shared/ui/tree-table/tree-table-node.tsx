import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useState, type CSSProperties } from 'react';

import { cn } from '@/shared/lib/utils';
import { Collapsible, CollapsibleContent } from '@/shared/ui/collapsible';
import { TableBody, TableCell, TableRow } from '@/shared/ui/table';

import { visibleColumns } from './columns';

import type {
  TreeTableColumn,
  TreeTableNode as TreeTableNodeModel,
} from './tree-table-types';

const TREE_INDENT_UNITS = 4;

function treeIndentStyle(depth: number): CSSProperties {
  return {
    paddingLeft: `calc(${depth} * var(--calc-spacing) * ${TREE_INDENT_UNITS})`,
  };
}

type TreeTableNodeProps<T> = {
  node: TreeTableNodeModel<T>;
  columns: TreeTableColumn<T>[];
  rowClassName: string;
  rowStyle: CSSProperties;
  defaultOpen: boolean;
  isGroup: (node: TreeTableNodeModel<T>) => boolean;
  getRowClassName?: (node: TreeTableNodeModel<T>) => string | undefined;
  depth?: number;
};

export function TreeTableNode<T>({
  node,
  columns,
  rowClassName,
  rowStyle,
  defaultOpen,
  isGroup,
  getRowClassName,
  depth = 0,
}: TreeTableNodeProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const group = isGroup(node);
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const visible = visibleColumns(columns);

  const row = (
    <TableRow
      aria-expanded={hasChildren ? isOpen : undefined}
      className={cn(
        rowClassName,
        getRowClassName?.(node),
        depth > 0 && 'calc:bg-muted/20',
        group && 'calc:bg-muted-foreground/10',
        hasChildren && 'calc:cursor-pointer'
      )}
      style={rowStyle}
      onClick={
        hasChildren
          ? () => {
              setIsOpen((open) => !open);
            }
          : undefined
      }
    >
      <TableCell
        className="calc:flex calc:items-center calc:justify-center calc:overflow-hidden calc:py-0"
        style={treeIndentStyle(depth)}
      >
        <div className="calc:[&_svg]:size-5">
          {hasChildren ? (
            isOpen ? (
              <ChevronDownIcon />
            ) : (
              <ChevronRightIcon />
            )
          ) : (
            <div className="calc:size-5" />
          )}
        </div>
      </TableCell>
      {visible.map((column) => (
        <TableCell
          key={column.id}
          className={cn('calc:overflow-hidden calc:py-0', column.className)}
        >
          {column.cell(node, { depth, isGroup: group, isOpen })}
        </TableCell>
      ))}
    </TableRow>
  );

  if (!hasChildren) {
    return <TableBody className="calc:[&_td]:py-0">{row}</TableBody>;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      render={<TableBody className="calc:[&_td]:py-0" />}
    >
      {row}
      <TableRow className="calc:grid calc:w-full calc:hover:bg-transparent">
        <TableCell className="calc:col-span-full calc:p-0" colSpan={visible.length + 1}>
          <CollapsibleContent>
            <div className="calc:w-full calc:border-b calc:border-border calc:bg-muted/20">
              <table className="calc:w-full calc:caption-bottom calc:text-sm">
                {children.map((child) => (
                  <TreeTableNode
                    key={child.id}
                    node={child}
                    columns={columns}
                    rowClassName={rowClassName}
                    rowStyle={rowStyle}
                    defaultOpen={defaultOpen}
                    isGroup={isGroup}
                    getRowClassName={getRowClassName}
                    depth={depth + 1}
                  />
                ))}
              </table>
            </div>
          </CollapsibleContent>
        </TableCell>
      </TableRow>
    </Collapsible>
  );
}
