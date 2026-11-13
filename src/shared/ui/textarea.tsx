import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'calc:flex calc:field-sizing-content calc:min-h-16 calc:w-full calc:resize-none calc:rounded-2xl calc:border calc:border-transparent calc:bg-input/50 calc:px-3 calc:py-3 calc:text-base calc:transition-[color,box-shadow,background-color] calc:outline-none calc:placeholder:text-muted-foreground calc:focus-visible:border-ring calc:focus-visible:ring-3 calc:focus-visible:ring-ring/30 calc:disabled:cursor-not-allowed calc:disabled:opacity-50 calc:aria-invalid:border-destructive calc:aria-invalid:ring-3 calc:aria-invalid:ring-destructive/20 calc:md:text-sm calc:dark:aria-invalid:border-destructive/50 calc:dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
