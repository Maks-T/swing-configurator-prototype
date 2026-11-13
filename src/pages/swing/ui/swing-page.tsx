import 'dockview-react/dist/styles/dockview.css';

import {
  DockviewReact,
  themeLight,
  type DockviewApi,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
} from 'dockview-react';
import { useCallback, useRef, type FunctionComponent } from 'react';

import { AppHeader } from '@/widgets/app-header';

import {
  applyDefaultLayout,
  PANEL,
  restoreLayout,
  saveLayout,
  type PanelId,
} from '../config/layout';
import { useDraftAutosave } from '../lib/use-draft-autosave';
import { useHistoryHotkeys } from '../lib/use-history-hotkeys';
import { useWorkspace } from '../lib/use-workspace';

import {
  ConstructionPanelView,
  DrawingsPanelView,
  EstimatePanelView,
  FacadePanel,
  PropertiesPanel,
} from './panels';

const COMPONENTS: Record<PanelId, FunctionComponent<IDockviewPanelProps>> = {
  [PANEL.construction]: ConstructionPanelView,
  [PANEL.facade]: FacadePanel,
  [PANEL.drawings]: DrawingsPanelView,
  [PANEL.properties]: PropertiesPanel,
  [PANEL.estimate]: EstimatePanelView,
};

/** Рабочее место конфигуратора распашных дверей: dockview-раскладка панелей */
export function SwingPage() {
  const ws = useWorkspace();
  const apiRef = useRef<DockviewApi | null>(null);
  useDraftAutosave();
  useHistoryHotkeys();

  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;
    restoreLayout(event.api);
    event.api.onDidLayoutChange(() => {
      saveLayout(event.api);
    });
  }, []);

  const resetLayout = useCallback(() => {
    if (apiRef.current) {
      applyDefaultLayout(apiRef.current);
    }
  }, []);

  return (
    <div className="calc:flex calc:h-dvh calc:w-full calc:flex-col calc:bg-muted/40 calc:text-foreground">
      {ws ? (
        <AppHeader project={ws.project} result={ws.result} onResetLayout={resetLayout} />
      ) : null}
      <div className="door-dockview calc:min-h-0 calc:flex-1">
        <DockviewReact components={COMPONENTS} onReady={onReady} theme={themeLight} />
      </div>
    </div>
  );
}
