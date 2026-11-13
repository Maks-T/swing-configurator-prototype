import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="calc:isolate calc:z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            'calc:z-50 calc:flex calc:w-72 calc:origin-(--transform-origin) calc:flex-col calc:gap-4 calc:rounded-3xl calc:bg-popover calc:p-4 calc:text-sm calc:text-popover-foreground calc:shadow-lg calc:ring-1 calc:ring-foreground/5 calc:outline-hidden calc:duration-100 calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[side=bottom]:slide-in-from-top-2 calc:data-[side=inline-end]:slide-in-from-left-2 calc:data-[side=inline-start]:slide-in-from-right-2 calc:data-[side=left]:slide-in-from-right-2 calc:data-[side=right]:slide-in-from-left-2 calc:data-[side=top]:slide-in-from-bottom-2 calc:dark:ring-foreground/10',
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('calc:flex calc:flex-col calc:gap-1 calc:text-sm', className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn('calc:text-base calc:font-medium', className)}
      {...props}
    />
  );
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn('calc:text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
