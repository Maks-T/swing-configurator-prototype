import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils/index';

const toggleVariants = cva(
  'calc:group/toggle calc:inline-flex calc:items-center calc:justify-center calc:gap-1 calc:rounded-3xl calc:text-sm calc:font-medium calc:whitespace-nowrap calc:transition-colors calc:outline-none calc:hover:bg-muted calc:hover:text-foreground calc:focus-visible:border-ring calc:focus-visible:ring-[3px] calc:focus-visible:ring-ring/30 calc:disabled:pointer-events-none calc:disabled:opacity-50 calc:aria-invalid:border-destructive calc:aria-invalid:ring-destructive/20 calc:aria-pressed:bg-muted calc:dark:aria-invalid:ring-destructive/40 calc:[&_svg]:pointer-events-none calc:[&_svg]:shrink-0 calc:[&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'calc:bg-transparent',
        outline: 'calc:border calc:border-input calc:bg-transparent calc:hover:bg-muted',
      },
      size: {
        default:
          'calc:h-9 calc:min-w-9 calc:px-3 calc:has-data-[icon=inline-end]:pr-2.5 calc:has-data-[icon=inline-start]:pl-2.5',
        sm: 'calc:h-8 calc:min-w-8 calc:px-3 calc:has-data-[icon=inline-end]:pr-2 calc:has-data-[icon=inline-start]:pl-2',
        lg: 'calc:h-10 calc:min-w-10 calc:px-4 calc:has-data-[icon=inline-end]:pr-3 calc:has-data-[icon=inline-start]:pl-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle };
