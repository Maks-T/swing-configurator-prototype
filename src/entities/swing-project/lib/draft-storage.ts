import { DRAFT_STORAGE_KEY } from '../model/consts';

import type { SwingProject } from '@calculation/swing';

/** Черновик проекта в localStorage (лёгкое удобство; ошибки хранилища не критичны) */
export function readDraft(): SwingProject | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as SwingProject;
    return parsed.setup?.kind === 'swing' ? parsed : null;
  } catch {
    return null;
  }
}

export function writeDraft(project: SwingProject): void {
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(project));
  } catch {
    // Хранилище недоступно (приватный режим, iframe) — черновик не сохраняем
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // нет доступа к хранилищу
  }
}
