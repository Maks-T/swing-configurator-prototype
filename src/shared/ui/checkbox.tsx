'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils/index';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'calc:peer calc:relative calc:flex calc:size-4 calc:shrink-0 calc:items-center calc:justify-center calc:rounded-[5px] calc:border calc:border-transparent calc:bg-input/90 calc:transition-shadow calc:outline-none calc:group-has-disabled/field:opacity-50 calc:after:absolute calc:after:-inset-x-3 calc:after:-inset-y-2 calc:focus-visible:border-ring calc:focus-visible:ring-3 calc:focus-visible:ring-ring/30 calc:disabled:cursor-not-allowed calc:disabled:opacity-50 calc:aria-invalid:border-destructive calc:aria-invalid:ring-3 calc:aria-invalid:ring-destructive/20 calc:aria-invalid:aria-checked:border-primary calc:data-checked:border-primary calc:data-checked:bg-primary calc:data-checked:text-primary-foreground calc:dark:aria-invalid:border-destructive/50 calc:dark:aria-invalid:ring-destructive/40 calc:dark:data-checked:bg-primary',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="calc:grid calc:place-content-center calc:text-current calc:transition-none calc:[&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
