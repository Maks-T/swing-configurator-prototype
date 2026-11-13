import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'calc:group/button calc:inline-flex calc:shrink-0 calc:cursor-pointer calc:items-center calc:justify-center calc:rounded-2xl calc:border calc:border-transparent calc:bg-clip-padding calc:text-sm calc:font-medium calc:whitespace-nowrap calc:transition-all calc:outline-none calc:select-none calc:focus-visible:border-ring calc:focus-visible:ring-3 calc:focus-visible:ring-ring/30 calc:active:not-aria-[haspopup]:translate-y-px calc:disabled:pointer-events-none calc:disabled:opacity-50 calc:aria-invalid:border-destructive calc:aria-invalid:ring-3 calc:aria-invalid:ring-destructive/20 calc:dark:aria-invalid:border-destructive/50 calc:dark:aria-invalid:ring-destructive/40 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'calc:bg-primary calc:text-primary-foreground calc:hover:bg-primary/80',
        outline:
          'calc:border-border calc:bg-background calc:hover:bg-muted calc:hover:text-foreground calc:aria-expanded:bg-muted calc:aria-expanded:text-foreground calc:dark:bg-transparent calc:dark:hover:bg-input/30',
        secondary:
          'calc:bg-secondary calc:text-secondary-foreground calc:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] calc:aria-expanded:bg-secondary calc:aria-expanded:text-secondary-foreground',
        ghost:
          'calc:hover:bg-muted calc:hover:text-foreground calc:aria-expanded:bg-muted calc:aria-expanded:text-foreground calc:dark:hover:bg-muted/50',
        destructive:
          'calc:bg-destructive/10 calc:text-destructive calc:hover:bg-destructive/20 calc:focus-visible:border-destructive/40 calc:focus-visible:ring-destructive/20 calc:dark:bg-destructive/20 calc:dark:hover:bg-destructive/30 calc:dark:focus-visible:ring-destructive/40',
        link: 'calc:text-primary calc:underline-offset-4 calc:hover:underline',
      },
      size: {
        default:
          'calc:h-9 calc:gap-1.5 calc:px-3 calc:has-data-[icon=inline-end]:pr-2.5 calc:has-data-[icon=inline-start]:pl-2.5',
        xs: 'calc:h-6 calc:gap-1 calc:px-2.5 calc:text-xs calc:has-data-[icon=inline-end]:pr-2 calc:has-data-[icon=inline-start]:pl-2 calc:[&_svg:not([class*=size-])]:size-3',
        sm: 'calc:h-8 calc:gap-1 calc:px-3 calc:has-data-[icon=inline-end]:pr-2 calc:has-data-[icon=inline-start]:pl-2',
        lg: 'calc:h-10 calc:gap-1.5 calc:px-4 calc:has-data-[icon=inline-end]:pr-3 calc:has-data-[icon=inline-start]:pl-3',
        icon: 'calc:size-9',
        'icon-xs': 'calc:size-6 calc:[&_svg:not([class*=size-])]:size-3',
        'icon-sm': 'calc:size-8',
        'icon-lg': 'calc:size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
