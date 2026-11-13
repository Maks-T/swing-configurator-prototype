import { cva, type VariantProps } from 'class-variance-authority';
import { useMemo } from 'react';

import { cn } from '@/shared/lib/utils';
import { Label } from '@/shared/ui/label';
import { Separator } from '@/shared/ui/separator';

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'calc:flex calc:flex-col calc:gap-6 calc:has-[>[data-slot=checkbox-group]]:gap-3 calc:has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'calc:mb-3 calc:font-medium calc:data-[variant=label]:text-sm calc:data-[variant=legend]:text-base',
        className
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'calc:group/field-group calc:@container/field-group calc:flex calc:w-full calc:flex-col calc:gap-7 calc:data-[slot=checkbox-group]:gap-3 calc:*:data-[slot=field-group]:gap-4',
        className
      )}
      {...props}
    />
  );
}

const fieldVariants = cva(
  'calc:group/field calc:flex calc:w-full calc:gap-2 calc:data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: 'calc:flex-col calc:*:w-full calc:[&>.sr-only]:w-auto',
        horizontal:
          'calc:flex-row calc:items-center calc:has-[>[data-slot=field-content]]:items-start calc:*:data-[slot=field-label]:flex-auto calc:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        responsive:
          'calc:flex-col calc:*:w-full calc:@md/field-group:flex-row calc:@md/field-group:items-center calc:@md/field-group:*:w-auto calc:@md/field-group:has-[>[data-slot=field-content]]:items-start calc:@md/field-group:*:data-[slot=field-label]:flex-auto calc:[&>.sr-only]:w-auto calc:@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
);

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        'calc:group/field-content calc:flex calc:flex-1 calc:flex-col calc:gap-1 calc:leading-snug',
        className
      )}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'calc:group/field-label calc:peer/field-label calc:flex calc:w-fit calc:gap-2 calc:leading-snug calc:group-data-[disabled=true]/field:opacity-50 calc:has-data-checked:bg-input/30 calc:has-[>[data-slot=field]]:rounded-2xl calc:has-[>[data-slot=field]]:border calc:*:data-[slot=field]:p-4',
        'calc:has-[>[data-slot=field]]:w-full calc:has-[>[data-slot=field]]:flex-col',
        className
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'calc:flex calc:w-fit calc:items-center calc:gap-2 calc:text-sm calc:font-medium calc:group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        'calc:text-left calc:text-sm calc:leading-normal calc:font-normal calc:text-muted-foreground calc:group-has-data-horizontal/field:text-balance calc:[[data-variant=legend]+&]:-mt-1.5',
        'calc:last:mt-0 calc:nth-last-2:-mt-1',
        'calc:[&>a]:underline calc:[&>a]:underline-offset-4 calc:[&>a:hover]:text-primary',
        className
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'calc:relative calc:-my-2 calc:h-5 calc:text-sm calc:group-data-[variant=outline]/field-group:-mb-2',
        className
      )}
      {...props}
    >
      <Separator className="calc:absolute calc:inset-0 calc:top-1/2" />
      {children && (
        <span
          className="calc:relative calc:mx-auto calc:block calc:w-fit calc:bg-background calc:px-2 calc:text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="calc:ml-4 calc:flex calc:list-disc calc:flex-col calc:gap-1">
        {uniqueErrors.map(
          (error, index) => error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn('calc:text-sm calc:font-normal calc:text-destructive', className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
