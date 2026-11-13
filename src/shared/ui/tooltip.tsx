import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { cn } from '@/shared/lib/utils/index';

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  variant = 'default',
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > & {
    variant?: 'default' | 'destructive';
  }) {
  const isDestructive = variant === 'destructive';

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="calc:isolate calc:z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          data-variant={variant}
          className={cn(
            'calc:z-50 calc:inline-flex calc:w-fit calc:max-w-xs calc:origin-(--transform-origin) calc:items-center calc:gap-1.5 calc:rounded-xl calc:bg-foreground calc:px-3 calc:py-1.5 calc:text-xs calc:text-background calc:has-data-[slot=kbd]:pr-1.5 calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[side=bottom]:slide-in-from-top-2 calc:data-[side=inline-end]:slide-in-from-left-2 calc:data-[side=inline-start]:slide-in-from-right-2 calc:data-[side=left]:slide-in-from-right-2 calc:data-[side=right]:slide-in-from-left-2 calc:data-[side=top]:slide-in-from-bottom-2 calc:**:data-[slot=kbd]:relative calc:**:data-[slot=kbd]:isolate calc:**:data-[slot=kbd]:z-50 calc:**:data-[slot=kbd]:rounded-lg calc:data-[state=delayed-open]:animate-in calc:data-[state=delayed-open]:fade-in-0 calc:data-[state=delayed-open]:zoom-in-95',
            isDestructive && 'calc:bg-destructive calc:text-background',
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            className={cn(
              'calc:z-50 calc:size-2.5 calc:translate-y-[calc(-50%-2px)] calc:rotate-45 calc:rounded-[2px] calc:bg-foreground calc:fill-foreground calc:data-[side=bottom]:top-1 calc:data-[side=inline-end]:top-1/2! calc:data-[side=inline-end]:-left-1 calc:data-[side=inline-end]:translate-x-[1.5px] calc:data-[side=inline-end]:-translate-y-1/2 calc:data-[side=inline-start]:top-1/2! calc:data-[side=inline-start]:-right-1 calc:data-[side=inline-start]:translate-x-[-1.5px] calc:data-[side=inline-start]:-translate-y-1/2 calc:data-[side=left]:top-1/2! calc:data-[side=left]:-right-1 calc:data-[side=left]:translate-x-[-1.5px] calc:data-[side=left]:-translate-y-1/2 calc:data-[side=right]:top-1/2! calc:data-[side=right]:-left-1 calc:data-[side=right]:translate-x-[1.5px] calc:data-[side=right]:-translate-y-1/2 calc:data-[side=top]:-bottom-2.5',
              isDestructive && 'calc:bg-destructive calc:fill-destructive'
            )}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
