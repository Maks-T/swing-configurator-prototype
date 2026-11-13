import { useEffect } from 'react';

import { useSwingProjectStore, writeDraft } from '@/entities/swing-project';

const SAVE_DELAY_MS = 600;

/** Черновик проекта в localStorage с задержкой после последней правки */
export function useDraftAutosave(): void {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = useSwingProjectStore.subscribe((state, prev) => {
      if (state.project === prev.project || !state.project) {
        return;
      }
      const { project } = state;
      clearTimeout(timer);
      timer = setTimeout(() => {
        writeDraft(project);
      }, SAVE_DELAY_MS);
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);
}
