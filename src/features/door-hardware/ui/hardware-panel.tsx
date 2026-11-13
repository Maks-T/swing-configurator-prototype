import { useDoorData } from '@/entities/door-catalog';
import { useSwingProjectStore } from '@/entities/swing-project';
import { NativeSelect } from '@/shared/ui/native-select';
import { FieldRow, PanelSection } from '@/shared/ui/panel-section';
import { Switch } from '@/shared/ui/switch';

import {
  getHandleOptions,
  getHingeGroups,
  getHinges,
  getLocks,
  getLockTypes,
  resolveHandleParts,
  resolveKeys,
  type DoorSetup,
} from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

const NO_HANDLE = '__none__';

type HardwarePanelProps = { setup: DoorSetup; result: SwingResult };

/** Петли, ручка и замок: списки зависят от короба и полотна */
export function HardwarePanel({ setup, result }: HardwarePanelProps) {
  const data = useDoorData();
  const patch = useSwingProjectStore.use.patch();
  const setHandle = useSwingProjectStore.use.setHandle();
  const groups = getHingeGroups(data, setup.frame, setup.door);
  const group = data.price(setup.hingeSku)?.type ?? groups[0]?.id ?? '';
  const hinges = group ? getHinges(data, group) : [];
  const handles = getHandleOptions(data, setup.door);
  const handleParts = setup.handle.handleSku
    ? resolveHandleParts(data, setup, resolveKeys(setup, data), setup.handle.handleSku)
    : null;
  const lockTypes = handleParts?.lock ? getLockTypes(data, handleParts.lock) : [];
  const lockType = setup.handle.lockType ?? lockTypes[0]?.id ?? '';
  const locks =
    handleParts?.lock && lockType ? getLocks(data, handleParts.lock, lockType) : [];
  const canIncut = setup.frameVariant === 'noFrame' || setup.isNoDoor;

  return (
    <div className="calc:flex calc:flex-col calc:divide-y">
      <PanelSection
        title="Петли"
        actions={
          <span className="calc:text-xs calc:tabular-nums">{result.hingeCount} шт</span>
        }
      >
        <FieldRow label="Тип">
          <NativeSelect
            value={group}
            onChange={(event) => {
              const first = getHinges(data, event.target.value)[0];
              if (first) {
                patch({ hingeSku: first.key }, data);
              }
            }}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </NativeSelect>
        </FieldRow>
        <FieldRow label="Цвет">
          <NativeSelect
            value={setup.hingeSku}
            onChange={(event) => {
              patch({ hingeSku: event.target.value }, data);
            }}
          >
            {hinges.map((h) => (
              <option key={h.key} value={h.key}>
                {h.name}
              </option>
            ))}
          </NativeSelect>
        </FieldRow>
        {canIncut ? (
          <FieldRow label="Только врезка">
            <Switch
              checked={setup.isHingeIncut}
              onCheckedChange={(isHingeIncut) => {
                patch({ isHingeIncut }, data);
              }}
            />
          </FieldRow>
        ) : null}
      </PanelSection>

      {setup.isNoDoor ? null : (
        <PanelSection title="Ручка и замок">
          <FieldRow label="Ручка">
            <NativeSelect
              value={setup.handle.handleSku ?? NO_HANDLE}
              onChange={(event) => {
                const value = event.target.value;
                setHandle(
                  value === NO_HANDLE ? { handleSku: null } : { handleSku: value },
                  data
                );
              }}
            >
              <option value={NO_HANDLE}>Без ручки</option>
              {handles.map((h) => (
                <option key={h.key} value={h.key}>
                  {h.name}
                </option>
              ))}
            </NativeSelect>
          </FieldRow>
          {lockTypes.length > 0 ? (
            <FieldRow label="Замок">
              <NativeSelect
                value={lockType}
                onChange={(event) => {
                  // Новый тип замка — цвет выбирается заново (первый в списке)
                  setHandle({ lockType: event.target.value, lockSku: undefined }, data);
                }}
              >
                {lockTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </NativeSelect>
            </FieldRow>
          ) : null}
          {locks.length > 1 ? (
            <FieldRow label="Цвет замка">
              <NativeSelect
                value={setup.handle.lockSku ?? locks[0]?.key ?? ''}
                onChange={(event) => {
                  setHandle({ lockSku: event.target.value }, data);
                }}
              >
                {locks.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.name}
                  </option>
                ))}
              </NativeSelect>
            </FieldRow>
          ) : null}
          {handleParts?.lockLarva ? (
            <FieldRow label="Личинка">
              <NativeSelect
                value={setup.handle.larvaType ?? ''}
                onChange={(event) => {
                  setHandle({ larvaType: event.target.value || undefined }, data);
                }}
              >
                <option value="">Без личинки</option>
                <option value="key-key">Ключ — ключ</option>
                <option value="key-wrap">Ключ — вертушка</option>
              </NativeSelect>
            </FieldRow>
          ) : null}
        </PanelSection>
      )}
    </div>
  );
}
