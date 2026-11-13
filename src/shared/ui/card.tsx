import * as React from 'react';

import { cn } from '@/shared/lib/utils';

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        'calc:group/card calc:flex calc:flex-col calc:gap-(--card-spacing) calc:overflow-hidden calc:rounded-2xl calc:bg-card calc:py-(--card-spacing) calc:text-sm calc:text-card-foreground calc:shadow-md calc:ring-1 calc:ring-foreground/5 calc:[--card-spacing:--spacing(6)] calc:has-[>img:first-child]:pt-0 calc:data-[size=sm]:[--card-spacing:--spacing(2)] calc:dark:ring-foreground/10 calc:*:[img:first-child]:rounded-t-2xl calc:*:[img:last-child]:rounded-b-2xl',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'calc:group/card-header calc:@container/card-header calc:grid calc:auto-rows-min calc:items-start calc:gap-1.5 calc:rounded-t-4xl calc:px-(--card-spacing) calc:has-data-[slot=card-action]:grid-cols-[1fr_auto] calc:has-data-[slot=card-description]:grid-rows-[auto_auto] calc:[.border-b]:pb-(--card-spacing)',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('calc:font-heading calc:text-base calc:font-medium', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('calc:text-sm calc:text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'calc:col-start-2 calc:row-span-2 calc:row-start-1 calc:self-start calc:justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('calc:px-(--card-spacing)', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'calc:flex calc:items-center calc:rounded-b-4xl calc:px-(--card-spacing) calc:[.border-t]:pt-(--card-spacing)',
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
