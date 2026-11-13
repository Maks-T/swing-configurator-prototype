import { cn } from '@/shared/lib/utils';
import { Spinner } from '@/shared/ui/spinner';

type QueryLoadingStateProps = {
  message?: string;
  className?: string;
};

export function QueryLoadingState({
  message = 'Загрузка…',
  className,
}: QueryLoadingStateProps) {
  return (
    <div
      className={cn(
        'calc:flex calc:flex-col calc:items-center calc:justify-center calc:gap-3',
        className
      )}
    >
      <Spinner className="calc:size-8" />
      <p className="calc:text-sm calc:text-muted-foreground">{message}</p>
    </div>
  );
}
