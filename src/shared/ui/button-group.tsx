import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { Separator } from '@/shared/ui/separator';

const buttonGroupVariants = cva(
  'calc:flex calc:w-fit calc:items-stretch calc:*:focus-visible:relative calc:*:focus-visible:z-10 calc:has-[>[data-slot=button-group]]:gap-2 calc:has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-border calc:has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-border calc:has-[>[data-variant=outline]]:[&>[data-slot=input-group]:has(:focus-visible)]:border-ring calc:has-[>[data-variant=outline]]:[&>[data-slot=select-trigger]:focus-visible]:border-ring calc:has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-4xl calc:[&>[data-slot=select-trigger]:not([class*=w-])]:w-fit calc:[&>input]:flex-1 calc:has-[>[data-variant=outline]]:[&>input]:border-border calc:has-[>[data-variant=outline]]:[&>input:focus-visible]:border-ring',
  {
    variants: {
      orientation: {
        horizontal:
          'calc:[&>[data-slot]:first-child]:rounded-l-4xl! calc:[&>[data-slot]:has(~[data-slot])]:rounded-r-none! calc:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-4xl! calc:[&>[data-slot]~[data-slot]]:rounded-l-none! calc:[&>[data-slot]~[data-slot]]:border-l-0',
        vertical:
          'calc:flex-col calc:[&>[data-slot]:first-child]:rounded-t-4xl! calc:[&>[data-slot]:has(~[data-slot])]:rounded-b-none! calc:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-4xl! calc:[&>[data-slot]~[data-slot]]:rounded-t-none! calc:[&>[data-slot]~[data-slot]]:border-t-0',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          "calc:flex calc:items-center calc:gap-2 calc:rounded-4xl calc:border calc:bg-muted calc:px-2.5 calc:text-sm calc:font-medium calc:[&_svg]:pointer-events-none calc:[&_svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: 'button-group-text',
    },
  });
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'calc:relative calc:self-stretch calc:bg-input calc:data-horizontal:mx-px calc:data-horizontal:w-auto calc:data-vertical:my-px calc:data-vertical:h-auto',
        className
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
