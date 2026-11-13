import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuTrigger({ className, ...props }: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn('calc:select-none', className)}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  align = 'start',
  alignOffset = 4,
  side = 'right',
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        className="calc:isolate calc:z-50 calc:outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            'calc: calc: calc:z-50 calc:max-h-(--available-height) calc:min-w-48 calc:origin-(--transform-origin) calc:overflow-x-hidden calc:overflow-y-auto calc:rounded-3xl calc:bg-popover calc:p-1 calc:text-popover-foreground calc:shadow-lg calc:ring-1 calc:ring-foreground/5 calc:duration-100 calc:outline-none calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[side=bottom]:slide-in-from-top-2 calc:data-[side=inline-end]:slide-in-from-left-2 calc:data-[side=inline-start]:slide-in-from-right-2 calc:data-[side=left]:slide-in-from-right-2 calc:data-[side=right]:slide-in-from-left-2 calc:data-[side=top]:slide-in-from-bottom-2 calc:dark:ring-foreground/10',
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        'calc:px-2 calc:py-1.5 calc:text-xs calc:text-muted-foreground calc:data-inset:pl-8',
        className
      )}
      {...props}
    />
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'calc:group/context-menu-item calc:relative calc:flex calc:cursor-default calc:items-center calc:gap-2 calc:rounded-2xl calc:px-2 calc:py-1 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:data-inset:pl-8 calc:data-[variant=destructive]:text-destructive calc:data-[variant=destructive]:focus:bg-destructive/10 calc:data-[variant=destructive]:focus:text-destructive calc:dark:data-[variant=destructive]:focus:bg-destructive/20 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4 calc:focus:*:[svg]:text-accent-foreground calc:data-[variant=destructive]:*:[svg]:text-destructive',
        className
      )}
      {...props}
    />
  );
}

function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'calc:flex calc:cursor-default calc:items-center calc:rounded-2xl calc:px-2 calc:py-1 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:data-inset:pl-8 calc:data-open:bg-accent calc:data-open:text-accent-foreground calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="calc:ml-auto" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function ContextMenuSubContent({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className="calc: calc: calc:shadow-lg"
      side="right"
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        'calc:relative calc:flex calc:cursor-default calc:items-center calc:gap-2 calc:rounded-2xl calc:py-1 calc:pr-7 calc:pl-2 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:data-inset:pl-8 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="calc:pointer-events-none calc:absolute calc:right-2">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup({ ...props }: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        'calc:relative calc:flex calc:cursor-default calc:items-center calc:gap-2 calc:rounded-2xl calc:py-1 calc:pr-7 calc:pl-2 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:data-inset:pl-8 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      <span className="calc:pointer-events-none calc:absolute calc:right-2">
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn('calc:-mx-1 calc:my-1 calc:h-px calc:bg-border/50', className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        'calc:ml-auto calc:text-xs calc:tracking-widest calc:text-muted-foreground calc:group-focus/context-menu-item:text-accent-foreground',
        className
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
