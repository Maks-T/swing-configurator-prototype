import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

import { Input } from './input';

type NumberFieldProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange' | 'type'
> & {
  value: number;
  onCommit: (value: number) => void;
  suffix?: string;
};

/** Числовое поле с применением по Enter / потере фокуса (без пересчёта на каждый символ) */
function NumberField({ value, onCommit, suffix, className, ...props }: NumberFieldProps) {
  const [draft, setDraft] = React.useState(String(value));
  const [focused, setFocused] = React.useState(false);

  const commit = () => {
    const next = Number(draft.replace(',', '.'));
    if (Number.isFinite(next) && next !== value) {
      onCommit(next);
    } else {
      setDraft(String(value));
    }
  };

  return (
    <div
      data-slot="number-field"
      className={cn('calc:relative calc:flex calc:items-center', className)}
    >
      <Input
        {...props}
        inputMode="decimal"
        value={focused ? draft : String(value)}
        onFocus={() => {
          setDraft(String(value));
          setFocused(true);
        }}
        onChange={(event) => {
          setDraft(event.target.value);
        }}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
          }
        }}
        className={cn('calc:tabular-nums', suffix ? 'calc:pr-9' : undefined)}
      />
      {suffix ? (
        <span className="calc:pointer-events-none calc:absolute calc:right-3 calc:text-xs calc:text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export { NumberField };
