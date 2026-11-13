import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '@/shared/lib/utils/index';

function ScrollArea({ className, children, ...props }: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('calc:relative calc:overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="calc:h-full calc:max-h-[inherit] calc:w-full calc:rounded-[inherit] calc:transition-[color,box-shadow] calc:outline-none calc:focus-visible:ring-[3px] calc:focus-visible:ring-ring/50 calc:focus-visible:outline-1"
      >
        <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'calc:flex calc:touch-none calc:p-px calc:transition-colors calc:select-none calc:data-horizontal:h-2.5 calc:data-horizontal:flex-col calc:data-horizontal:border-t calc:data-horizontal:border-t-transparent calc:data-vertical:h-full calc:data-vertical:w-2.5 calc:data-vertical:border-l calc:data-vertical:border-l-transparent',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="calc:relative calc:flex-1 calc:rounded-full calc:bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
