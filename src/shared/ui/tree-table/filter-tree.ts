export type FilterTreeAccessors<TNode> = {
  getChildren: (node: TNode) => TNode[];
  withChildren: (node: TNode, children: TNode[]) => TNode;
  isGroup: (node: TNode) => boolean;
  isZero: (node: TNode) => boolean;
};

export type FilterTreeOptions = {
  showZeroItems?: boolean;
  showEmptyGroups?: boolean;
};

export function filterTree<TNode>(
  nodes: TNode[],
  accessors: FilterTreeAccessors<TNode>,
  options: FilterTreeOptions = {}
): TNode[] {
  const showZeroItems = options.showZeroItems ?? false;
  const showEmptyGroups = options.showEmptyGroups ?? false;

  return nodes.flatMap((node) => {
    const filtered = filterNode(node, accessors, { showZeroItems, showEmptyGroups });
    return filtered ? [filtered] : [];
  });
}

function hasLeafItems<TNode>(
  node: TNode,
  accessors: FilterTreeAccessors<TNode>
): boolean {
  if (!accessors.isGroup(node)) {
    return true;
  }

  return accessors.getChildren(node).some((child) => hasLeafItems(child, accessors));
}

function filterNode<TNode>(
  node: TNode,
  accessors: FilterTreeAccessors<TNode>,
  options: Required<FilterTreeOptions>
): TNode | null {
  if (!accessors.isGroup(node)) {
    if (!options.showZeroItems && accessors.isZero(node)) {
      return null;
    }

    return node;
  }

  const children = filterTree(accessors.getChildren(node), accessors, options);
  const nextNode = accessors.withChildren(node, children);

  if (!options.showEmptyGroups && !hasLeafItems(nextNode, accessors)) {
    return null;
  }

  return nextNode;
}
