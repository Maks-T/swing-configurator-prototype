import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'calc:flex calc:w-full calc:min-w-0 calc:flex-1 calc:flex-col calc:items-center calc:justify-center calc:gap-4 calc:rounded-2xl calc:border-dashed calc:p-12 calc:text-center calc:text-balance',
        className
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        'calc:flex calc:max-w-sm calc:flex-col calc:items-center calc:gap-2',
        className
      )}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  'calc:mb-2 calc:flex calc:shrink-0 calc:items-center calc:justify-center calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'calc:bg-transparent',
        icon: 'calc:flex calc:size-10 calc:shrink-0 calc:items-center calc:justify-center calc:rounded-xl calc:bg-muted calc:text-foreground calc:[&_svg:not([class*=size-])]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        'calc:font-heading calc:text-lg calc:font-medium calc:tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        'calc:text-sm/relaxed calc:text-muted-foreground calc:[&>a]:underline calc:[&>a]:underline-offset-4 calc:[&>a:hover]:text-primary',
        className
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'calc:flex calc:w-full calc:max-w-sm calc:min-w-0 calc:flex-col calc:items-center calc:gap-4 calc:text-sm calc:text-balance',
        className
      )}
      {...props}
    />
  );
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia };
