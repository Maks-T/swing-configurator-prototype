// Не используем id вроде 'constructor': dockview хранит панели в объектах-словарях
import type { DockviewApi } from 'dockview-react';

export const PANEL = {
  construction: 'construction',
  facade: 'facade',
  drawings: 'drawings',
  properties: 'properties',
  estimate: 'estimate',
} as const;

export type PanelId = (typeof PANEL)[keyof typeof PANEL];

export const LAYOUT_STORAGE_KEY = 'swing-configurator:layout:v1';

/** Раскладка: каталог конструкции слева, фасад и чертежи в центре, свойства справа, смета снизу */
export function applyDefaultLayout(api: DockviewApi): void {
  api.clear();
  api.addPanel({ id: PANEL.facade, component: PANEL.facade, title: 'Фасад' });
  api.addPanel({
    id: PANEL.drawings,
    component: PANEL.drawings,
    title: 'Чертежи',
    position: { referencePanel: PANEL.facade, direction: 'within' },
    inactive: true,
  });
  api.addPanel({
    id: PANEL.construction,
    component: PANEL.construction,
    title: 'Конструкция',
    position: { referencePanel: PANEL.facade, direction: 'left' },
    initialWidth: 300,
  });
  api.addPanel({
    id: PANEL.properties,
    component: PANEL.properties,
    title: 'Свойства',
    position: { referencePanel: PANEL.facade, direction: 'right' },
    initialWidth: 340,
  });
  api.addPanel({
    id: PANEL.estimate,
    component: PANEL.estimate,
    title: 'Смета',
    position: { referencePanel: PANEL.facade, direction: 'below' },
    initialHeight: 320,
  });
}
/** Восстановление сохранённой раскладки; при ошибке — раскладка по умолчанию */
export function restoreLayout(api: DockviewApi): void {
  try {
    const raw = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (raw) {
      api.fromJSON(JSON.parse(raw));
      if (api.panels.length > 0) {
        return;
      }
    }
  } catch {
    // повреждённая раскладка — строим заново
  }
  applyDefaultLayout(api);
}

export function saveLayout(api: DockviewApi): void {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(api.toJSON()));
  } catch {
    // приватный режим или переполнение — раскладка просто не запомнится
  }
}
