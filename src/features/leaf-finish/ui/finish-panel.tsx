import { getGlassSwatch, useDoorData } from '@/entities/door-catalog';
import { useSwingProjectStore } from '@/entities/swing-project';
import { Swatch } from '@/shared/ui/choice-card';
import { NativeSelect } from '@/shared/ui/native-select';
import { FieldRow, PanelSection } from '@/shared/ui/panel-section';

import {
  getBorderOptions,
  getGlassOptions,
  type DecorSide,
  type DoorSetup,
  type PriceRow,
} from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

const SIDE_TITLE: Record<DecorSide, string> = {
  front: 'Лицевая сторона',
  back: 'Тыльная сторона',
};
const NONE = '';

/** Группировка стёкол по типу прайса (SGD, SGS…) для optgroup */
function groupByType(rows: readonly PriceRow[]): [string, PriceRow[]][] {
  const map = new Map<string, PriceRow[]>();
  rows.forEach((row) => {
    const type = row.type ?? '';
    map.set(type, [...(map.get(type) ?? []), row]);
  });
  return [...map.entries()];
}

/** Отделка полотна: стекло на каждую сторону и окантовка прозрачного стекла */
export function FinishPanel({
  setup,
  result,
}: {
  setup: DoorSetup;
  result: SwingResult;
}) {
  const data = useDoorData();
  const setInsert = useSwingProjectStore.use.setInsert();
  const glass = getGlassOptions(data, setup.door);
  const groups = groupByType(glass);
  const borders = getBorderOptions(data);

  if (setup.isNoDoor) {
    return (
      <p className="calc:p-3 calc:text-sm calc:text-muted-foreground">
        Без полотна — отделка не нужна
      </p>
    );
  }

  return (
    <div className="calc:flex calc:flex-col calc:divide-y">
      {result.keys.decorSides.map((side) => {
        const insert = setup.inserts[side];
        const part = result.inserts.find((p) => p.side === side);
        const swatch = getGlassSwatch(insert ? data.price(insert.sku) : undefined);
        return (
          <PanelSection key={side} title={SIDE_TITLE[side]}>
            <FieldRow label="Стекло">
              <div className="calc:flex calc:min-w-0 calc:items-center calc:gap-1.5">
                <Swatch color={insert ? swatch.color : 'transparent'} size={18} />
                <NativeSelect
                  value={insert?.sku ?? NONE}
                  onChange={(event) => {
                    const sku = event.target.value;
                    setInsert(
                      side,
                      sku
                        ? {
                            ...(insert?.borderSku ? { borderSku: insert.borderSku } : {}),
                            sku,
                          }
                        : null,
                      data
                    );
                  }}
                >
                  <option value={NONE}>Не выбрано</option>
                  {groups.map(([type, rows]) => (
                    <optgroup key={type} label={type}>
                      {rows.map((row) => (
                        <option key={row.key} value={row.key}>
                          {row.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </NativeSelect>
              </div>
            </FieldRow>
            {insert && borders.length > 0 ? (
              <FieldRow label="Окантовка">
                <NativeSelect
                  value={insert.borderSku ?? NONE}
                  onChange={(event) => {
                    const borderSku = event.target.value;
                    setInsert(
                      side,
                      borderSku ? { ...insert, borderSku } : { sku: insert.sku },
                      data
                    );
                  }}
                >
                  <option value={NONE}>По умолчанию</option>
                  {borders.map((row) => (
                    <option key={row.key} value={row.key}>
                      {row.name}
                    </option>
                  ))}
                </NativeSelect>
              </FieldRow>
            ) : null}
            {part ? (
              <p className="calc:text-xs calc:text-muted-foreground calc:tabular-nums">
                {part.width} × {part.height} мм · {part.area.toFixed(3)} м²
                {part.hardness ? ' · закалка' : ''}
              </p>
            ) : null}
          </PanelSection>
        );
      })}
      {glass.length === 0 ? (
        <p className="calc:p-3 calc:text-sm calc:text-muted-foreground">
          Для этого полотна стёкол в прайсе нет
        </p>
      ) : null}
    </div>
  );
}
