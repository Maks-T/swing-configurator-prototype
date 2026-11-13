import { getCoverColor, useDoorData } from '@/entities/door-catalog';
import { useSwingProjectStore } from '@/entities/swing-project';
import { Swatch } from '@/shared/ui/choice-card';
import { PanelSection } from '@/shared/ui/panel-section';
import { Switch } from '@/shared/ui/switch';

import { CoverPicker } from './cover-picker';

import type { DoorSetup } from '@calculation/door-kit';

/** Покрытие профиля короба и полотна (по умолчанию одно на оба) */
export function CoversPanel({ setup }: { setup: DoorSetup }) {
  const data = useDoorData();
  const patch = useSwingProjectStore.use.patch();
  const isSame = setup.frameCoverSku === setup.doorCoverSku;
  const name = (sku: string) => data.price(sku)?.name ?? sku;

  const header = (sku: string) => (
    <span className="calc:flex calc:items-center calc:gap-1.5 calc:text-sm">
      <Swatch color={getCoverColor(name(sku))} size={16} />
      {name(sku)}
    </span>
  );

  return (
    <div className="calc:flex calc:flex-col calc:divide-y">
      <PanelSection
        title={isSame ? 'Покрытие короба и полотна' : 'Покрытие короба'}
        actions={
          <label className="calc:flex calc:items-center calc:gap-1.5 calc:text-xs calc:text-muted-foreground">
            одно на всё
            <Switch
              size="sm"
              checked={isSame}
              onCheckedChange={(checked) => {
                if (checked) {
                  patch({ doorCoverSku: setup.frameCoverSku }, data);
                }
              }}
            />
          </label>
        }
      >
        {header(setup.frameCoverSku)}
        <CoverPicker
          value={setup.frameCoverSku}
          onChange={(sku) => {
            patch(
              isSame ? { frameCoverSku: sku, doorCoverSku: sku } : { frameCoverSku: sku },
              data
            );
          }}
        />
        {isSame ? (
          <button
            type="button"
            className="calc:cursor-pointer calc:self-start calc:text-xs calc:text-primary calc:hover:underline"
            onClick={() => {
              const other = setup.frameCoverSku === 'blackMate' ? 'white' : 'blackMate';
              patch(
                { doorCoverSku: data.price(other) ? other : setup.frameCoverSku },
                data
              );
            }}
          >
            Задать полотну другое покрытие
          </button>
        ) : null}
      </PanelSection>
      {isSame || setup.isNoDoor ? null : (
        <PanelSection title="Покрытие полотна">
          {header(setup.doorCoverSku)}
          <CoverPicker
            value={setup.doorCoverSku}
            onChange={(sku) => {
              patch({ doorCoverSku: sku }, data);
            }}
          />
        </PanelSection>
      )}
    </div>
  );
}
