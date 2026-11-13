import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        'calc:fixed calc:inset-0 calc:isolate calc:z-50 calc:bg-black/30 calc:duration-100 calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-open:animate-in calc:data-open:fade-in-0 calc:supports-backdrop-filter:backdrop-blur-sm',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  size = 'default',
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: 'default' | 'sm';
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          'calc:group/alert-dialog-content calc:fixed calc:top-1/2 calc:left-1/2 calc:z-50 calc:grid calc:w-full calc:-translate-x-1/2 calc:-translate-y-1/2 calc:gap-6 calc:rounded-4xl calc:bg-popover calc:p-6 calc:text-popover-foreground calc:shadow-xl calc:ring-1 calc:ring-foreground/5 calc:duration-100 calc:outline-none calc:data-closed:animate-out calc:data-closed:fade-out-0 calc:data-closed:zoom-out-95 calc:data-open:animate-in calc:data-open:fade-in-0 calc:data-open:zoom-in-95 calc:data-[size=default]:max-w-xs calc:data-[size=sm]:max-w-xs calc:data-[size=default]:sm:max-w-md calc:dark:ring-foreground/10',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        'calc:grid calc:grid-rows-[auto_1fr] calc:place-items-center calc:gap-1.5 calc:text-center calc:has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] calc:has-data-[slot=alert-dialog-media]:gap-x-6 calc:sm:group-data-[size=default]/alert-dialog-content:place-items-start calc:sm:group-data-[size=default]/alert-dialog-content:text-left calc:sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'calc:flex calc:flex-col-reverse calc:gap-2 calc:group-data-[size=sm]/alert-dialog-content:grid calc:group-data-[size=sm]/alert-dialog-content:grid-cols-2 calc:sm:flex-row calc:sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        'calc:mb-2 calc:inline-flex calc:size-16 calc:items-center calc:justify-center calc:rounded-full calc:bg-muted calc:sm:group-data-[size=default]/alert-dialog-content:row-span-2 calc:*:[svg:not([class*=size-])]:size-8',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        'calc:font-heading calc:text-lg calc:font-medium calc:sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        'calc:text-sm calc:text-balance calc:text-muted-foreground calc:md:text-pretty calc:*:[a]:underline calc:*:[a]:underline-offset-3 calc:*:[a]:hover:text-foreground',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button data-slot="alert-dialog-action" className={cn(className)} {...props} />;
}

function AlertDialogCancel({
  className,
  variant = 'outline',
  size = 'default',
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
