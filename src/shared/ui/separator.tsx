'use client';

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';

import { cn } from '@/shared/lib/utils/index';

function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        'calc:shrink-0 calc:bg-border calc:data-horizontal:h-px calc:data-horizontal:w-full calc:data-vertical:w-px calc:data-vertical:self-stretch',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
