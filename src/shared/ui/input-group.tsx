import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'calc:group/input-group calc:relative calc:flex calc:h-9 calc:w-full calc:min-w-0 calc:items-center calc:rounded-4xl calc:border calc:border-transparent calc:bg-input/50 calc:transition-[color,box-shadow,background-color] calc:outline-none calc:in-data-[slot=combobox-content]:focus-within:border-inherit calc:in-data-[slot=combobox-content]:focus-within:ring-0 calc:has-data-[align=block-end]:rounded-3xl calc:has-data-[align=block-start]:rounded-3xl calc:has-[[data-slot=input-group-control]:focus-visible]:border-ring calc:has-[[data-slot=input-group-control]:focus-visible]:ring-3 calc:has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 calc:has-[[data-slot][aria-invalid=true]]:border-destructive calc:has-[[data-slot][aria-invalid=true]]:ring-3 calc:has-[[data-slot][aria-invalid=true]]:ring-destructive/20 calc:has-[textarea]:rounded-2xl calc:has-[>[data-align=block-end]]:h-auto calc:has-[>[data-align=block-end]]:flex-col calc:has-[>[data-align=block-start]]:h-auto calc:has-[>[data-align=block-start]]:flex-col calc:has-[>textarea]:h-auto calc:dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 calc:has-[>[data-align=block-end]]:[&>input]:pt-3 calc:has-[>[data-align=block-start]]:[&>input]:pb-3 calc:has-[>[data-align=inline-end]]:[&>input]:pr-1.5 calc:has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  'calc:flex calc:h-auto calc:cursor-text calc:items-center calc:justify-center calc:gap-2 calc:py-2 calc:text-sm calc:font-medium calc:text-muted-foreground calc:select-none calc:group-data-[disabled=true]/input-group:opacity-50 calc:**:data-[slot=kbd]:rounded-3xl calc:**:data-[slot=kbd]:bg-muted-foreground/10 calc:**:data-[slot=kbd]:px-1.5 calc:[&>svg:not([class*=size-])]:size-4',
  {
    variants: {
      align: {
        'inline-start':
          'calc:order-first calc:pl-3 calc:has-[>button]:-ml-1 calc:has-[>kbd]:-ml-1',
        'inline-end':
          'calc:order-last calc:pr-3 calc:has-[>button]:-mr-1 calc:has-[>kbd]:-mr-1',
        'block-start':
          'calc:order-first calc:w-full calc:justify-start calc:px-3 calc:pt-3 calc:group-has-[>input]/input-group:pt-3.5 calc:[.border-b]:pb-3.5',
        'block-end':
          'calc:order-last calc:w-full calc:justify-start calc:px-3 calc:pb-3 calc:group-has-[>input]/input-group:pb-3.5 calc:[.border-t]:pt-3.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  'calc:flex calc:items-center calc:gap-2 calc:rounded-4xl calc:text-sm calc:shadow-none',
  {
    variants: {
      size: {
        xs: 'calc:h-6 calc:gap-1 calc:rounded-xl calc:px-1.5 calc:[&>svg:not([class*=size-])]:size-3.5',
        sm: 'calc:',
        'icon-xs': 'calc:size-6 calc:rounded-xl calc:p-0 calc:has-[>svg]:p-0',
        'icon-sm': 'calc:size-8 calc:p-0 calc:has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
);

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: 'button' | 'submit' | 'reset';
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'calc:flex calc:items-center calc:gap-2 calc:text-sm calc:text-muted-foreground calc:[&_svg]:pointer-events-none calc:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'calc:flex-1 calc:rounded-none calc:border-0 calc:bg-transparent calc:shadow-none calc:ring-0 calc:focus-visible:ring-0 calc:aria-invalid:ring-0 calc:dark:bg-transparent',
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'calc:flex-1 calc:resize-none calc:rounded-none calc:border-0 calc:bg-transparent calc:py-2.5 calc:shadow-none calc:ring-0 calc:focus-visible:ring-0 calc:aria-invalid:ring-0 calc:dark:bg-transparent',
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
