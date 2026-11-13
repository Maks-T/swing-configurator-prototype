import { CadViewer } from 'cad-blueprint/viewer';
import { FileDown, Maximize2, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useDoorData } from '@/entities/door-catalog';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { buildDoorDrawings, DRAWING_SHEETS } from '../lib/build-drawings';

import type { DoorSetup } from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

const ZOOM_STEP = 1.25;

type DrawingsPanelProps = { setup: DoorSetup; result: SwingResult };

/** Чертежи двери: фасады снаружи/изнутри и спецификация; просмотр, SVG, DXF, VCAD */
export function DrawingsPanel({ setup, result }: DrawingsPanelProps) {
  const data = useDoorData();
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CadViewer | null>(null);
  const [zoom, setZoom] = useState(1);
  const [current, setSheet] = useState<string>('outside');
  const sheets = DRAWING_SHEETS;
  const doc = useMemo(
    () => buildDoorDrawings(setup, result, data),
    [setup, result, data]
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }
    const viewer = new CadViewer(host, doc, {
      sheet: current,
      background: 'transparent',
      paper: '#ffffff',
      fitMargin: 24,
      wheelFactor: 1.08,
      maxZoom: 40,
    });
    viewerRef.current = viewer;
    const off = viewer.on((event) => {
      if (event.type === 'view') {
        setZoom(event.zoom);
      }
    });
    // Панель dockview могла быть скрыта при монтировании — вписываем при первом размере
    const observer = new ResizeObserver(() => {
      if (host.clientWidth > 0 && host.clientHeight > 0) {
        viewer.fitToView();
        observer.disconnect();
      }
    });
    observer.observe(host);
    return () => {
      observer.disconnect();
      off();
      viewer.destroy();
      viewerRef.current = null;
    };
    // Вьюер создаётся один раз; документ и лист обновляются эффектами ниже
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    viewerRef.current?.setDocument(doc, { keepView: true });
  }, [doc]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.setSheet(current);
      viewer.fitToView();
    }
  }, [current]);

  const fileName = `swing-${current}`;

  return (
    <div className="calc:flex calc:size-full calc:min-h-0 calc:flex-col calc:bg-muted/40">
      <div className="calc:flex calc:items-center calc:gap-2 calc:border-b calc:bg-background calc:px-2 calc:py-1.5">
        <div
          className="calc:flex calc:min-w-0 calc:flex-1 calc:gap-1 calc:overflow-x-auto"
          role="tablist"
          aria-label="Листы"
        >
          {sheets.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={current === s.id}
              onClick={() => {
                setSheet(s.id);
              }}
              className={cn(
                'calc:shrink-0 calc:cursor-pointer calc:rounded-xl calc:px-2.5 calc:py-1 calc:text-xs calc:text-muted-foreground calc:hover:bg-muted',
                current === s.id &&
                  'calc:bg-primary/10 calc:font-medium calc:text-primary'
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
        <div className="calc:flex calc:items-center calc:gap-0.5">
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Отдалить"
            onClick={() => viewerRef.current?.zoomBy(1 / ZOOM_STEP)}
          >
            <Minus />
          </Button>
          <button
            type="button"
            title="Вписать"
            className="calc:w-12 calc:cursor-pointer calc:text-center calc:text-xs calc:tabular-nums"
            onClick={() => viewerRef.current?.fitToView()}
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Приблизить"
            onClick={() => viewerRef.current?.zoomBy(ZOOM_STEP)}
          >
            <Plus />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Вписать"
            onClick={() => viewerRef.current?.fitToView()}
          >
            <Maximize2 />
          </Button>
          <span className="calc:mx-1 calc:h-5 calc:w-px calc:bg-border" />
          <Button
            size="xs"
            variant="ghost"
            title="Текущий лист в SVG (печать в масштабе)"
            onClick={() => viewerRef.current?.downloadSvg(fileName)}
          >
            <FileDown />
            SVG
          </Button>
          <Button
            size="xs"
            variant="ghost"
            title="Текущий лист в DXF (AutoCAD, nanoCAD, Компас)"
            onClick={() => viewerRef.current?.downloadDxf(fileName)}
          >
            DXF
          </Button>
          <Button
            size="xs"
            variant="ghost"
            title="Все листы (.vcad)"
            onClick={() => viewerRef.current?.downloadVcad('swing')}
          >
            VCAD
          </Button>
        </div>
      </div>
      <div ref={hostRef} className="calc:relative calc:min-h-0 calc:flex-1" />
    </div>
  );
}
