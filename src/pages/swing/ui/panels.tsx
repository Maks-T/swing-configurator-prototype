import { useState, type ReactNode } from 'react';

import { DoorFacade } from '@/widgets/door-facade';
import { DrawingsPanel } from '@/widgets/door-drawings';
import { EstimatePanel } from '@/widgets/estimate-panel';
import { ConstructionPanel } from '@/features/door-construction';
import { CoversPanel } from '@/features/door-covers';
import { HardwarePanel } from '@/features/door-hardware';
import { FinishPanel } from '@/features/leaf-finish';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import { useWorkspace } from '../lib/use-workspace';

function Scroll({ children }: { children: ReactNode }) {
  return (
    <div className="calc:size-full calc:overflow-auto calc:bg-background">{children}</div>
  );
}

export function ConstructionPanelView() {
  const ws = useWorkspace();
  return ws ? (
    <Scroll>
      <ConstructionPanel setup={ws.setup} result={ws.result} />
    </Scroll>
  ) : null;
}

export function FacadePanel() {
  const ws = useWorkspace();
  return ws ? (
    <div className="calc:flex calc:size-full calc:flex-col calc:bg-background">
      <DoorFacade setup={ws.setup} result={ws.result} className="calc:flex-1" />
    </div>
  ) : null;
}

type PropertiesTab = 'hardware' | 'covers' | 'finish';

export function PropertiesPanel() {
  const ws = useWorkspace();
  const [tab, setTab] = useState<PropertiesTab>('hardware');
  if (!ws) {
    return null;
  }
  return (
    <Scroll>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value as PropertiesTab);
        }}
        className="calc:flex-col calc:gap-0"
      >
        <TabsList className="calc:m-2 calc:mb-0 calc:h-9">
          <TabsTrigger value="hardware">Фурнитура</TabsTrigger>
          <TabsTrigger value="covers">Покрытие</TabsTrigger>
          <TabsTrigger value="finish">Отделка</TabsTrigger>
        </TabsList>
        <TabsContent value="hardware">
          <HardwarePanel setup={ws.setup} result={ws.result} />
        </TabsContent>
        <TabsContent value="covers">
          <CoversPanel setup={ws.setup} />
        </TabsContent>
        <TabsContent value="finish">
          <FinishPanel setup={ws.setup} result={ws.result} />
        </TabsContent>
      </Tabs>
    </Scroll>
  );
}

export function EstimatePanelView() {
  const ws = useWorkspace();
  return ws ? (
    <div className="calc:size-full calc:bg-background">
      <EstimatePanel setup={ws.setup} result={ws.result} />
    </div>
  ) : null;
}

export function DrawingsPanelView() {
  const ws = useWorkspace();
  return ws ? <DrawingsPanel setup={ws.setup} result={ws.result} /> : null;
}
