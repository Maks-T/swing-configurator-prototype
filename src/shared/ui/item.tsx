import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';
import { Separator } from '@/shared/ui/separator';

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        'calc:group/item-group calc:flex calc:w-full calc:flex-col calc:gap-4 calc:has-data-[size=sm]:gap-2.5 calc:has-data-[size=xs]:gap-2',
        className
      )}
      {...props}
    />
  );
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn('calc:my-2', className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  'calc:group/item calc:flex calc:w-full calc:flex-wrap calc:items-center calc:rounded-2xl calc:border calc:text-sm calc:transition-colors calc:duration-100 calc:outline-none calc:focus-visible:border-ring calc:focus-visible:ring-[3px] calc:focus-visible:ring-ring/50 calc:[a]:transition-colors calc:[a]:hover:bg-muted',
  {
    variants: {
      variant: {
        default: 'calc:border-transparent',
        outline: 'calc:border-border',
        muted: 'calc:border-transparent calc:bg-muted/50',
      },
      size: {
        default: 'calc:gap-3.5 calc:px-4 calc:py-3.5',
        sm: 'calc:gap-3.5 calc:px-3.5 calc:py-3',
        xs: 'calc:gap-2.5 calc:px-3 calc:py-2.5 calc:in-data-[slot=dropdown-menu-content]:p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Item({
  className,
  variant = 'default',
  size = 'default',
  render,
  ...props
}: useRender.ComponentProps<'div'> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: 'item',
      variant,
      size,
    },
  });
}

const itemMediaVariants = cva(
  'calc:flex calc:shrink-0 calc:items-center calc:justify-center calc:gap-2 calc:group-has-data-[slot=item-description]/item:translate-y-0.5 calc:group-has-data-[slot=item-description]/item:self-start calc:[&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'calc:bg-transparent',
        icon: 'calc:[&_svg:not([class*=size-])]:size-4',
        image:
          'calc:size-10 calc:overflow-hidden calc:rounded-xl calc:group-data-[size=sm]/item:size-8 calc:group-data-[size=xs]/item:size-6 calc:group-data-[size=xs]/item:rounded-lg calc:[&_img]:size-full calc:[&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function ItemMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        'calc:flex calc:flex-1 calc:flex-col calc:gap-1 calc:group-data-[size=xs]/item:gap-0.5 calc:[&+[data-slot=item-content]]:flex-none',
        className
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        'calc:line-clamp-1 calc:flex calc:w-fit calc:items-center calc:gap-2 calc:text-sm calc:leading-snug calc:font-medium calc:underline-offset-4',
        className
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        'calc:line-clamp-2 calc:text-left calc:text-sm calc:font-normal calc:text-muted-foreground calc:[&>a]:underline calc:[&>a]:underline-offset-4 calc:[&>a:hover]:text-primary',
        className
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('calc:flex calc:items-center calc:gap-2', className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        'calc:flex calc:basis-full calc:items-center calc:justify-between calc:gap-2',
        className
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        'calc:flex calc:basis-full calc:items-center calc:justify-between calc:gap-2',
        className
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
