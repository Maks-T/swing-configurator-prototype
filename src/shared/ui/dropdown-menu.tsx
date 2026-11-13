import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="calc:isolate calc:z-50 calc:outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'calc: calc: calc:z-50 calc:max-h-(--available-height) calc:w-(--anchor-width) calc:min-w-48 calc:origin-(--transform-origin) calc:overflow-x-hidden calc:overflow-y-auto calc:rounded-3xl calc:bg-popover calc:p-1.5 calc:text-popover-foreground calc:shadow-lg calc:ring-1 calc:ring-foreground/5 calc:duration-100 calc:outline-none calc:data-closed:animate-out calc:data-closed:overflow-hidden calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[side=bottom]:slide-in-from-top-2 calc:data-[side=inline-end]:slide-in-from-left-2 calc:data-[side=inline-start]:slide-in-from-right-2 calc:data-[side=left]:slide-in-from-right-2 calc:data-[side=right]:slide-in-from-left-2 calc:data-[side=top]:slide-in-from-bottom-2 calc:dark:ring-foreground/10',
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'calc:px-2.5 calc:py-1.5 calc:text-xs calc:text-muted-foreground calc:data-inset:pl-8',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'calc:group/dropdown-menu-item calc:relative calc:flex calc:cursor-default calc:items-center calc:gap-2 calc:rounded-2xl calc:px-2.5 calc:py-1.5 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:not-data-[variant=destructive]:focus:**:text-accent-foreground calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:data-inset:pl-8 calc:data-[variant=destructive]:text-destructive calc:data-[variant=destructive]:focus:bg-destructive/10 calc:data-[variant=destructive]:focus:text-destructive calc:dark:data-[variant=destructive]:focus:bg-destructive/20 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4 calc:data-[variant=destructive]:*:[svg]:text-destructive',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'calc:flex calc:cursor-default calc:items-center calc:gap-2 calc:rounded-2xl calc:px-2.5 calc:py-1.5 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:not-data-[variant=destructive]:focus:**:text-accent-foreground calc:data-inset:pl-8 calc:data-open:bg-accent calc:data-open:text-accent-foreground calc:data-popup-open:bg-accent calc:data-popup-open:text-accent-foreground calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="calc:ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'calc: calc: calc:w-auto calc:min-w-36 calc:rounded-3xl calc:bg-popover calc:p-1.5 calc:text-popover-foreground calc:shadow-lg calc:ring-1 calc:ring-foreground/5 calc:duration-100 calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[side=bottom]:slide-in-from-top-2 calc:data-[side=left]:slide-in-from-right-2 calc:data-[side=right]:slide-in-from-left-2 calc:data-[side=top]:slide-in-from-bottom-2 calc:dark:ring-foreground/10',
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        'calc:relative calc:flex calc:cursor-default calc:items-center calc:gap-2 calc:rounded-2xl calc:py-1.5 calc:pr-8 calc:pl-2.5 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:focus:**:text-accent-foreground calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:data-inset:pl-8 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="calc:pointer-events-none calc:absolute calc:right-2 calc:flex calc:items-center calc:justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        'calc:relative calc:flex calc:cursor-default calc:items-center calc:gap-2 calc:rounded-2xl calc:py-1.5 calc:pr-8 calc:pl-2.5 calc:text-sm calc:font-medium calc:outline-hidden calc:select-none calc:focus:bg-accent calc:focus:text-accent-foreground calc:focus:**:text-accent-foreground calc:data-disabled:pointer-events-none calc:data-disabled:opacity-50 calc:data-inset:pl-8 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      <span
        className="calc:pointer-events-none calc:absolute calc:right-2 calc:flex calc:items-center calc:justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('calc:-mx-1.5 calc:my-1 calc:h-px calc:bg-border/50', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'calc:ml-auto calc:text-xs calc:tracking-widest calc:text-muted-foreground calc:group-focus/dropdown-menu-item:text-accent-foreground',
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
