import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'calc:h-9 calc:w-full calc:min-w-0 calc:rounded-3xl calc:border calc:border-transparent calc:bg-input/50 calc:px-3 calc:py-1 calc:text-base calc:transition-[color,box-shadow,background-color] calc:outline-none calc:file:inline-flex calc:file:h-7 calc:file:border-0 calc:file:bg-transparent calc:file:text-sm calc:file:font-medium calc:file:text-foreground calc:placeholder:text-muted-foreground calc:focus-visible:border-ring calc:focus-visible:ring-3 calc:focus-visible:ring-ring/30 calc:disabled:pointer-events-none calc:disabled:cursor-not-allowed calc:disabled:opacity-50 calc:aria-invalid:border-destructive calc:aria-invalid:ring-3 calc:aria-invalid:ring-destructive/20 calc:md:text-sm calc:dark:aria-invalid:border-destructive/50 calc:dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

export { Input };
