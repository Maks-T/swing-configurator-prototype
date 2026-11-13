import { InfoIcon } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

import type { ComponentProps, ReactNode } from 'react';

type HintTooltipProps = {
  text: ReactNode;
  label?: string;
  children: ReactNode;
  variant?: ComponentProps<typeof TooltipContent>['variant'];
} & Pick<ComponentProps<typeof Tooltip>, 'open' | 'onOpenChange'>;

export function HintTooltip({
  text,
  label,
  children,
  variant,
  open,
  onOpenChange,
}: HintTooltipProps) {
  const ariaLabel = label ?? (typeof text === 'string' ? text : undefined);

  return (
    <Tooltip open={open} onOpenChange={onOpenChange} disableHoverablePopup>
      <TooltipTrigger
        render={
          <button
            type="button"
            className="calc:inline-flex"
            aria-label={ariaLabel}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent
        className={typeof text === 'string' ? undefined : 'calc:items-start calc:py-2'}
        variant={variant}
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

type InfoTooltipProps = {
  children: ReactNode;
  label?: string;
};

export function InfoTooltip({ children, label }: InfoTooltipProps) {
  return (
    <HintTooltip text={children} label={label}>
      <InfoIcon className="calc:size-3.5 calc:text-muted-foreground" />
    </HintTooltip>
  );
}
