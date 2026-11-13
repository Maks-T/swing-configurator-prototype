import type { EstimateNode } from '@calculation/door-kit';
import type { TreeTableNode } from '@/shared/ui/tree-table';

/** Дерево сметы → узлы TreeTable; id — путь по индексам (артикулы в смете повторяются) */
export function toTreeNodes(
  nodes: readonly EstimateNode[],
  parent = ''
): TreeTableNode<EstimateNode>[] {
  return nodes.map((node, i) => {
    const id = `${parent}${i}`;
    return {
      id,
      data: node,
      ...(node.children.length > 0
        ? { children: toTreeNodes(node.children, `${id}.`) }
        : {}),
    };
  });
}

/** Названия позиций без цены в прайсе */
export function collectPlaceholders(nodes: readonly EstimateNode[]): string[] {
  const out = new Set<string>();
  const walk = (list: readonly EstimateNode[]) => {
    list.forEach((n) => {
      if (n.isPlaceholder) {
        out.add(n.name);
      }
      walk(n.children);
    });
  };
  walk(nodes);
  return [...out];
}
