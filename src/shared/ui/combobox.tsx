'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { ChevronDownIcon, XIcon, CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';
import { Button } from '@/shared/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/input-group';

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn('calc:[&_svg:not([class*=size-])]:size-4', className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="calc:pointer-events-none calc:size-4 calc:text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="calc:pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup className={cn('calc:w-auto', className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="calc:group-has-data-[slot=combobox-clear]/input-group:hidden calc:data-pressed:bg-transparent"
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="calc:isolate calc:z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            'calc: calc: calc:group/combobox-content calc:relative calc:max-h-(--available-height) calc:w-(--anchor-width) calc:max-w-(--available-width) calc:min-w-[calc(var(--anchor-width)+--spacing(7))] calc:origin-(--transform-origin) calc:overflow-hidden calc:rounded-3xl calc:bg-popover calc:text-popover-foreground calc:shadow-lg calc:ring-1 calc:ring-foreground/5 calc:duration-100 calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[chips=true]:min-w-(--anchor-width) calc:data-[side=bottom]:slide-in-from-top-2 calc:data-[side=inline-end]:slide-in-from-left-2 calc:data-[side=inline-start]:slide-in-from-right-2 calc:data-[side=left]:slide-in-from-right-2 calc:data-[side=right]:slide-in-from-left-2 calc:data-[side=top]:slide-in-from-bottom-2 calc:*:data-[slot=input-group]:m-1.5 calc:*:data-[slot=input-group]:mb-0 calc:*:data-[slot=input-group]:h-8 calc:*:data-[slot=input-group]:border-input/30 calc:*:data-[slot=input-group]:bg-input/50 calc:*:data-[slot=input-group]:shadow-none calc:dark:ring-foreground/10',
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        'calc:no-scrollbar calc:max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] calc:scroll-py-1.5 calc:overflow-y-auto calc:overscroll-contain calc:p-1.5 calc:data-empty:p-0',
        className
      )}
      {...props}
    />
  );
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        'calc:relative calc:flex calc:w-full calc:cursor-default calc:items-center calc:gap-2.5 calc:rounded-2xl calc:py-2 calc:pr-8 calc:pl-3 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:data-highlighted:bg-accent calc:data-highlighted:text-accent-foreground calc:not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="calc:pointer-events-none calc:absolute calc:right-2 calc:flex calc:size-4 calc:items-center calc:justify-center" />
        }
      >
        <CheckIcon className="calc:pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  );
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        'calc:px-3 calc:py-2.5 calc:text-xs calc:text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        'calc:hidden calc:w-full calc:justify-center calc:py-2 calc:text-center calc:text-sm calc:text-muted-foreground calc:group-data-empty/combobox-content:flex',
        className
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn('calc:-mx-1.5 calc:my-1.5 calc:h-px calc:bg-border', className)}
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        'calc:flex calc:min-h-9 calc:flex-wrap calc:items-center calc:gap-1.5 calc:rounded-3xl calc:border calc:border-transparent calc:bg-input/50 calc:bg-clip-padding calc:px-3 calc:py-1.5 calc:text-sm calc:transition-[color,box-shadow,background-color] calc:focus-within:border-ring calc:focus-within:ring-3 calc:focus-within:ring-ring/30 calc:has-aria-invalid:border-destructive calc:has-aria-invalid:ring-3 calc:has-aria-invalid:ring-destructive/20 calc:has-data-[slot=combobox-chip]:px-1.5 calc:dark:has-aria-invalid:border-destructive/50 calc:dark:has-aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        'calc:flex calc:h-[calc(--spacing(5.5))] calc:w-fit calc:items-center calc:justify-center calc:gap-1 calc:rounded-3xl calc:bg-input calc:px-2 calc:text-xs calc:font-medium calc:whitespace-nowrap calc:text-foreground calc:has-disabled:pointer-events-none calc:has-disabled:cursor-not-allowed calc:has-disabled:opacity-50 calc:has-data-[slot=combobox-chip-remove]:pr-0 calc:dark:bg-input/60',
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="calc:-ml-1 calc:opacity-50 calc:hover:opacity-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="calc:pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn('calc:min-w-16 calc:flex-1 calc:outline-none', className)}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
};
