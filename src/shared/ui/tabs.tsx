import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils/index';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        'calc:group/tabs calc:flex calc:gap-2 calc:data-horizontal:flex-col',
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'calc:group/tabs-list calc:inline-flex calc:w-fit calc:items-center calc:justify-center calc:rounded-full calc:p-1 calc:text-muted-foreground calc:group-data-horizontal/tabs:h-9 calc:group-data-vertical/tabs:h-fit calc:group-data-vertical/tabs:flex-col calc:group-data-vertical/tabs:rounded-2xl calc:data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'calc:bg-muted',
        line: 'calc:gap-1 calc:bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        'calc:relative calc:inline-flex calc:h-[calc(100%-1px)] calc:flex-1 calc:items-center calc:justify-center calc:gap-2 calc:rounded-full calc:border calc:border-transparent! calc:px-3 calc:py-1 calc:text-sm calc:font-medium calc:whitespace-nowrap calc:text-foreground/60 calc:transition-all calc:group-data-vertical/tabs:w-full calc:group-data-vertical/tabs:justify-start calc:group-data-vertical/tabs:rounded-2xl calc:group-data-vertical/tabs:px-3 calc:group-data-vertical/tabs:py-1.5 calc:hover:text-foreground calc:focus-visible:border-ring calc:focus-visible:ring-[3px] calc:focus-visible:ring-ring/50 calc:focus-visible:outline-1 calc:focus-visible:outline-ring calc:disabled:pointer-events-none calc:disabled:opacity-50 calc:has-data-[icon=inline-end]:pr-2 calc:has-data-[icon=inline-start]:pl-2 calc:aria-disabled:pointer-events-none calc:aria-disabled:opacity-50 calc:dark:text-muted-foreground calc:dark:hover:text-foreground calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
        'calc:group-data-[variant=line]/tabs-list:bg-transparent calc:group-data-[variant=line]/tabs-list:data-active:bg-transparent calc:dark:group-data-[variant=line]/tabs-list:data-active:border-transparent calc:dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
        'calc:data-active:bg-background calc:data-active:text-foreground calc:dark:data-active:border-input calc:dark:data-active:bg-input/30 calc:dark:data-active:text-foreground',
        'calc:after:absolute calc:after:bg-foreground calc:after:opacity-0 calc:after:transition-opacity calc:group-data-horizontal/tabs:after:inset-x-0 calc:group-data-horizontal/tabs:after:bottom-[-5px] calc:group-data-horizontal/tabs:after:h-0.5 calc:group-data-vertical/tabs:after:inset-y-0 calc:group-data-vertical/tabs:after:-right-1 calc:group-data-vertical/tabs:after:w-0.5 calc:group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('calc:flex-1 calc:text-sm calc:outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
