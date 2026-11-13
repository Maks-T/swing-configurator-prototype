import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

type ChoiceCardProps = Omit<React.ComponentProps<'button'>, 'title'> & {
  isSelected: boolean;
  title: React.ReactNode;
  hint?: React.ReactNode;
  media?: React.ReactNode;
};

/** Карточка выбора варианта (короб, полотно, сторона открывания) */
function ChoiceCard({
  isSelected,
  title,
  hint,
  media,
  className,
  disabled,
  ...props
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      className={cn(
        'calc:flex calc:min-w-0 calc:cursor-pointer calc:items-center calc:gap-2 calc:rounded-2xl calc:border calc:bg-card calc:px-2.5 calc:py-2 calc:text-left calc:text-sm calc:transition-colors calc:hover:bg-muted calc:disabled:cursor-not-allowed calc:disabled:opacity-45',
        isSelected &&
          'calc:border-primary calc:bg-primary/5 calc:ring-2 calc:ring-primary/20',
        className
      )}
      {...props}
    >
      {media}
      <span className="calc:flex calc:min-w-0 calc:flex-col">
        <span className={cn('calc:truncate', isSelected && 'calc:font-medium')}>
          {title}
        </span>
        {hint ? (
          <span className="calc:truncate calc:text-xs calc:text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </span>
    </button>
  );
}

type SwatchProps = React.ComponentProps<'span'> & { color: string; size?: number };

/** Квадрат-образец цвета */
function Swatch({ color, size = 20, className, style, ...props }: SwatchProps) {
  return (
    <span
      className={cn(
        'calc:inline-block calc:shrink-0 calc:rounded-md calc:border calc:border-black/10',
        className
      )}
      style={{ width: size, height: size, background: color, ...style }}
      {...props}
    />
  );
}

export { ChoiceCard, Swatch };
