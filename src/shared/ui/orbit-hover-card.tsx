import { createElement, type ReactElement, type ReactNode } from 'react';

import { getOrbitItemOffsets } from '@/shared/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card';

export type OrbitHoverCardItem = {
  id: string;
  node: ReactNode;
};

export type OrbitHoverCardProps = {
  radius: number;
  maxItems: number;
  direction: Point;
  /** Начальное угловое смещение от direction в градусах. По часовой > 0. @default 0 */
  startOffset?: number;
  selectedItems: readonly OrbitHoverCardItem[];
  children: ReactNode;
  /** Элемент-триггер: хост уходит в `render`, children — в `HoverCardTrigger`. */
  trigger: ReactElement;
  onOpenChange?: (open: boolean) => void;
};

/** Base UI: `render` — пустой хост, контент — children триггера. */
function splitTrigger(trigger: ReactElement): {
  host: ReactElement;
  children: ReactNode;
} {
  const { children, ...hostProps } = trigger.props as {
    children?: ReactNode;
  };

  return {
    host: createElement(trigger.type, hostProps),
    children,
  };
}

/** Hover-card с выбранными элементами по орбите вокруг триггера. */
export function OrbitHoverCard({
  radius,
  maxItems,
  direction,
  startOffset,
  selectedItems,
  children,
  trigger,
  onOpenChange,
}: OrbitHoverCardProps) {
  const { host, children: triggerChildren } = splitTrigger(trigger);
  const visibleItems = selectedItems.slice(0, maxItems);
  const offsets = getOrbitItemOffsets({
    count: selectedItems.length,
    maxItems,
    radius,
    direction,
    startOffset,
  });

  return (
    <div className="calc:relative calc:inline-flex">
      {visibleItems.map((item, index) => {
        const offset = offsets.at(index);

        if (!offset) {
          return null;
        }

        return (
          <div
            key={item.id}
            className="calc:pointer-events-auto calc:absolute calc:top-1/2 calc:left-1/2 calc:z-10"
            style={{
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
            }}
          >
            {item.node}
          </div>
        );
      })}
      <HoverCard onOpenChange={onOpenChange}>
        <HoverCardTrigger delay={0} closeDelay={100} render={host}>
          {triggerChildren}
        </HoverCardTrigger>
        <HoverCardContent className="calc:w-auto calc:min-w-44 calc:p-3">
          {children}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
