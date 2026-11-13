import { useSwingProjectStore, useSwingResult } from '@/entities/swing-project';

import type { DoorSetup } from '@calculation/door-kit';
import type { SwingProject, SwingResult } from '@calculation/swing';

export type Workspace = { project: SwingProject; setup: DoorSetup; result: SwingResult };

/** Проект и расчёт одним объектом (null до инициализации) */
export function useWorkspace(): Workspace | null {
  const project = useSwingProjectStore((state) => state.project);
  const result = useSwingResult();
  if (!project || !result) {
    return null;
  }
  return { project, setup: project.setup, result };
}
