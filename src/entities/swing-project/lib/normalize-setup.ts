import {
  getFrameOptions,
  getGlassOptions,
  getHandleOptions,
  getHingeGroups,
  getHinges,
  getLeafOptions,
  type DoorSetup,
  type LegacyData,
} from '@calculation/door-kit';

const firstEnabled = <T extends { id: string; disabled?: boolean }>(
  list: readonly T[]
): string => list.find((o) => !o.disabled)?.id ?? '';

/**
 * Приводит выбор к допустимому: короб и полотно доступны для стороны открывания,
 * петля — из пересечения групп короба и полотна, ручка и стекло — из списков полотна.
 * Так любая правка (сменили короб) не оставляет несовместимых позиций.
 */
export function normalizeSetup(setup: DoorSetup, data: LegacyData): DoorSetup {
  const frames = getFrameOptions(data, setup.kind, setup.openSide);
  const frame = frames.some((f) => f.id === setup.frame && !f.disabled)
    ? setup.frame
    : firstEnabled(frames);
  const leaves = getLeafOptions(data, setup.openSide);
  const door = leaves.some((l) => l.id === setup.door && !l.disabled)
    ? setup.door
    : firstEnabled(leaves);

  const groups = getHingeGroups(data, frame, door);
  const currentGroup = data.price(setup.hingeSku)?.type;
  const group = groups.find((g) => g.id === currentGroup) ?? groups[0];
  const hinges = group ? getHinges(data, group.id) : [];
  const hingeSku = hinges.some((h) => h.key === setup.hingeSku)
    ? setup.hingeSku
    : (hinges[0]?.key ?? '');

  const handles = getHandleOptions(data, door);
  const handleSku =
    setup.handle.handleSku && handles.some((h) => h.key === setup.handle.handleSku)
      ? setup.handle.handleSku
      : null;

  const glass = new Set(getGlassOptions(data, door).map((g) => g.key));
  const inserts = Object.fromEntries(
    Object.entries(setup.inserts).filter(([, insert]) => insert && glass.has(insert.sku))
  ) as DoorSetup['inserts'];

  return {
    ...setup,
    frame,
    door,
    hingeSku,
    inserts,
    handle: handleSku ? { ...setup.handle, handleSku } : { handleSku: null },
  };
}
