import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

/** Нативный select в стиле полей shadcn: длинные списки (RAL, стекло) без виртуализации */
function NativeSelect({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        'calc:h-9 calc:w-full calc:min-w-0 calc:cursor-pointer calc:rounded-3xl calc:border calc:border-transparent calc:bg-input/50 calc:px-3 calc:text-sm calc:outline-none calc:focus-visible:border-ring calc:focus-visible:ring-3 calc:focus-visible:ring-ring/30 calc:disabled:cursor-not-allowed calc:disabled:opacity-50 calc:aria-invalid:border-destructive',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { NativeSelect };
