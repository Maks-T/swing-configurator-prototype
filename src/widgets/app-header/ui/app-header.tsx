import { Redo2, Undo2 } from 'lucide-react';

import { ProjectFileMenu } from '@/features/project-file';
import { useSwingProjectStore } from '@/entities/swing-project';
import { formatMoney } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import type { SwingProject, SwingResult } from '@calculation/swing';

type AppHeaderProps = {
  project: SwingProject;
  result: SwingResult;
  onResetLayout: () => void;
};

/** Шапка: название двери, история, файл проекта, раскладка, итог */
export function AppHeader({ project, result, onResetLayout }: AppHeaderProps) {
  const canUndo = useSwingProjectStore((state) => state.past.length > 0);
  const canRedo = useSwingProjectStore((state) => state.future.length > 0);
  const rename = useSwingProjectStore.use.rename();
  const undo = useSwingProjectStore.use.undo();
  const redo = useSwingProjectStore.use.redo();
  const { opening } = project.setup;

  return (
    <header className="calc:flex calc:h-12 calc:shrink-0 calc:items-center calc:gap-3 calc:border-b calc:bg-card calc:px-3">
      <div className="calc:flex calc:items-center calc:gap-2">
        <span className="calc:inline-flex calc:size-7 calc:items-center calc:justify-center calc:rounded-lg calc:bg-primary calc:text-xs calc:font-bold calc:text-primary-foreground">
          Д
        </span>
        <span className="calc:hidden calc:text-sm calc:font-semibold calc:lg:inline">
          Распашные двери
        </span>
      </div>
      <input
        aria-label="Название двери"
        value={project.name}
        onChange={(event) => {
          rename(event.target.value);
        }}
        className="calc:w-40 calc:rounded-lg calc:bg-transparent calc:px-2 calc:py-1 calc:text-sm calc:outline-none calc:hover:bg-muted calc:focus:bg-muted"
      />
      <span className="calc:text-xs calc:text-muted-foreground calc:tabular-nums">
        {opening.width} × {opening.height} мм
      </span>

      <div className="calc:ml-auto calc:flex calc:items-center calc:gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Отменить"
          title="Отменить (Ctrl+Z)"
          disabled={!canUndo}
          onClick={undo}
        >
          <Undo2 />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Повторить"
          title="Повторить (Ctrl+Shift+Z)"
          disabled={!canRedo}
          onClick={redo}
        >
          <Redo2 />
        </Button>
        <ProjectFileMenu />
        <Button size="xs" variant="ghost" onClick={onResetLayout}>
          Раскладка
        </Button>
        <span className="calc:mx-1 calc:h-6 calc:w-px calc:bg-border" />
        {result.isValid ? null : <Badge variant="destructive">Есть ошибки</Badge>}
        <span className="calc:text-sm calc:font-semibold calc:tabular-nums">
          {formatMoney(result.totals.final, result.totals.currency)}
        </span>
      </div>
    </header>
  );
}
