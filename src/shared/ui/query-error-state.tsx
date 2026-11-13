import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

type QueryErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionLabel?: string;
  footer?: string;
  isRetrying?: boolean;
  className?: string;
};

export function QueryErrorState({
  title = 'Не удалось загрузить данные',
  description = 'Проверьте подключение и попробуйте снова',
  onRetry,
  actionLabel = 'Повторить',
  footer,
  isRetrying = false,
  className,
}: QueryErrorStateProps) {
  return (
    <div
      className={cn(
        'calc:flex calc:flex-col calc:items-center calc:justify-center calc:gap-4 calc:p-6 calc:text-center',
        className
      )}
    >
      <div className="calc:flex calc:flex-col calc:gap-1">
        <h1 className="calc:text-lg calc:font-medium">{title}</h1>
        <p className="calc:text-sm calc:text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? <Spinner data-icon="inline-start" /> : null}
          {actionLabel}
        </Button>
      ) : footer ? (
        <p className="calc:text-sm calc:text-muted-foreground">{footer}</p>
      ) : null}
    </div>
  );
}
