import * as React from 'react';

import { cn } from '@/shared/lib/utils';

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'calc:flex calc:items-center calc:gap-2 calc:text-sm calc:leading-none calc:font-medium calc:select-none calc:group-data-[disabled=true]:pointer-events-none calc:group-data-[disabled=true]:opacity-50 calc:peer-disabled:cursor-not-allowed calc:peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Label };
