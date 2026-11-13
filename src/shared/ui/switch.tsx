import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/shared/lib/utils/index';

function Switch({
  className,
  size = 'default',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'calc:peer calc:group/switch calc:relative calc:inline-flex calc:shrink-0 calc:items-center calc:rounded-full calc:border-2 calc:transition-all calc:outline-none calc:group-has-[:focus-visible]/field-label:ring-0 calc:after:absolute calc:after:-inset-x-3 calc:after:-inset-y-2 calc:focus-visible:border-ring calc:focus-visible:ring-3 calc:focus-visible:ring-ring/30 calc:aria-invalid:border-destructive calc:aria-invalid:ring-3 calc:aria-invalid:ring-destructive/20 calc:data-checked:border-primary calc:data-checked:bg-primary calc:group-has-[:focus-visible]/field-label:data-checked:border-primary calc:data-disabled:cursor-not-allowed calc:data-disabled:opacity-50 calc:data-unchecked:border-transparent calc:data-unchecked:bg-input/90 calc:group-has-[:focus-visible]/field-label:data-unchecked:border-transparent calc:data-[size=default]:h-5 calc:data-[size=default]:w-11 calc:data-[size=sm]:h-4 calc:data-[size=sm]:w-7 calc:dark:aria-invalid:border-destructive/50 calc:dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="calc:pointer-events-none calc:block calc:rounded-full calc:bg-background calc:shadow-sm calc:ring-0 calc:transition-transform calc:not-dark:bg-clip-padding calc:group-data-[size=default]/switch:h-4 calc:group-data-[size=default]/switch:w-6 calc:group-data-[size=sm]/switch:h-3 calc:group-data-[size=sm]/switch:w-4 calc:data-checked:translate-x-[calc(100%-8px)] calc:data-unchecked:translate-x-0 calc:dark:data-checked:bg-primary-foreground calc:dark:data-unchecked:bg-foreground"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
