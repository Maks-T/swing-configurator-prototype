import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils/index';

const badgeVariants = cva(
  'calc:group/badge calc:inline-flex calc:h-5 calc:w-fit calc:shrink-0 calc:items-center calc:justify-center calc:gap-1 calc:overflow-hidden calc:rounded-3xl calc:border calc:border-transparent calc:px-2 calc:py-0.5 calc:text-xs calc:font-medium calc:whitespace-nowrap calc:transition-all calc:focus-visible:border-ring calc:focus-visible:ring-[3px] calc:focus-visible:ring-ring/50 calc:has-data-[icon=inline-end]:pr-1.5 calc:has-data-[icon=inline-start]:pl-1.5 calc:aria-invalid:border-destructive calc:aria-invalid:ring-destructive/20 calc:dark:aria-invalid:ring-destructive/40 calc:[&>svg]:pointer-events-none calc:[&>svg]:size-3!',
  {
    variants: {
      variant: {
        default:
          'calc:bg-primary calc:text-primary-foreground calc:[a]:hover:bg-primary/80',
        success: 'calc:bg-green-600 calc:text-background calc:[a]:hover:bg-green-700',
        secondary:
          'calc:bg-secondary calc:text-secondary-foreground calc:[a]:hover:bg-secondary/80',
        destructive:
          'calc:bg-destructive/10 calc:text-destructive calc:focus-visible:ring-destructive/20 calc:dark:bg-destructive/20 calc:dark:focus-visible:ring-destructive/40 calc:[a]:hover:bg-destructive/20',
        outline:
          'calc:border-border calc:text-foreground calc:[a]:hover:bg-muted calc:[a]:hover:text-muted-foreground',
        ghost:
          'calc:hover:bg-muted calc:hover:text-muted-foreground calc:dark:hover:bg-muted/50',
        link: 'calc:text-primary calc:underline-offset-4 calc:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge };
