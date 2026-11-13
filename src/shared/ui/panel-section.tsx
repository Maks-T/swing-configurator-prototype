import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

type PanelSectionProps = React.ComponentProps<'section'> & {
  title: string;
  actions?: React.ReactNode;
};

/** Секция панели dockview: заголовок + содержимое */
function PanelSection({
  title,
  actions,
  className,
  children,
  ...props
}: PanelSectionProps) {
  return (
    <section
      data-slot="panel-section"
      className={cn('calc:flex calc:flex-col calc:gap-2 calc:p-3', className)}
      {...props}
    >
      <header className="calc:flex calc:items-center calc:justify-between calc:gap-2">
        <h3 className="calc:text-[11px] calc:font-semibold calc:tracking-wider calc:text-muted-foreground calc:uppercase">
          {title}
        </h3>
        {actions}
      </header>
      {children}
    </section>
  );
}

type FieldRowProps = React.ComponentProps<'label'> & { label: string };

/** Строка «подпись — контрол» */
function FieldRow({ label, className, children, ...props }: FieldRowProps) {
  return (
    <label
      className={cn(
        'calc:grid calc:grid-cols-[7.5rem_1fr] calc:items-center calc:gap-2 calc:text-sm',
        className
      )}
      {...props}
    >
      <span className="calc:text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export { FieldRow, PanelSection };
