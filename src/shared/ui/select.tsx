import { Select as SelectPrimitive } from '@base-ui/react/select';
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('calc:scroll-my-1.5 calc:p-1.5', className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('calc:flex calc:flex-1 calc:text-left', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default';
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'calc:flex calc:w-fit calc:items-center calc:justify-between calc:gap-1.5 calc:rounded-3xl calc:border calc:border-transparent calc:bg-input/50 calc:px-3 calc:py-2 calc:text-sm calc:whitespace-nowrap calc:transition-[color,box-shadow,background-color] calc:outline-none calc:focus-visible:border-ring calc:focus-visible:ring-3 calc:focus-visible:ring-ring/30 calc:disabled:cursor-not-allowed calc:disabled:opacity-50 calc:aria-invalid:border-destructive calc:aria-invalid:ring-3 calc:aria-invalid:ring-destructive/20 calc:data-placeholder:text-muted-foreground calc:data-[size=default]:h-9 calc:data-[size=sm]:h-8 calc:*:data-[slot=select-value]:line-clamp-1 calc:*:data-[slot=select-value]:flex calc:*:data-[slot=select-value]:items-center calc:*:data-[slot=select-value]:gap-1.5 calc:dark:aria-invalid:border-destructive/50 calc:dark:aria-invalid:ring-destructive/40 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="calc:pointer-events-none calc:size-4 calc:text-muted-foreground" />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="calc:isolate calc:z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            'calc:relative calc:isolate calc:z-50 calc:max-h-(--available-height) calc:w-(--anchor-width) calc:min-w-36 calc:origin-(--transform-origin) calc:overflow-x-hidden calc:overflow-y-auto calc:rounded-3xl calc:bg-popover calc:text-popover-foreground calc:shadow-lg calc:ring-1 calc:ring-foreground/5 calc:duration-100 calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[align-trigger=true]:animate-none calc:data-[side=bottom]:slide-in-from-top-2 calc:data-[side=inline-end]:slide-in-from-left-2 calc:data-[side=inline-start]:slide-in-from-right-2 calc:data-[side=left]:slide-in-from-right-2 calc:data-[side=right]:slide-in-from-left-2 calc:data-[side=top]:slide-in-from-bottom-2 calc:dark:ring-foreground/10',
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        'calc:px-3 calc:py-2.5 calc:text-xs calc:text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'calc:relative calc:flex calc:w-full calc:cursor-default calc:items-center calc:gap-2.5 calc:rounded-2xl calc:py-2 calc:pr-8 calc:pl-3 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:not-data-[variant=destructive]:focus:**:text-accent-foreground calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4 calc:*:[span]:last:flex calc:*:[span]:last:items-center calc:*:[span]:last:gap-2',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="calc:flex calc:min-w-0 calc:flex-1 calc:items-center calc:gap-2 calc:overflow-hidden">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="calc:pointer-events-none calc:absolute calc:right-2 calc:flex calc:size-4 calc:items-center calc:justify-center" />
        }
      >
        <CheckIcon className="calc:pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'calc:pointer-events-none calc:-mx-1.5 calc:my-1.5 calc:h-px calc:bg-border',
        className
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        'calc:top-0 calc:z-10 calc:flex calc:w-full calc:cursor-default calc:items-center calc:justify-center calc:bg-popover calc:py-1 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        'calc:bottom-0 calc:z-10 calc:flex calc:w-full calc:cursor-default calc:items-center calc:justify-center calc:bg-popover calc:py-1 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
