import { normalizeSetup } from './normalize-setup';

import type { DoorSetup, LegacyData } from '@calculation/door-kit';

/** Дверь по умолчанию — как в легаси при открытии калькулятора */
export function createDefaultSetup(data: LegacyData): DoorSetup {
  return normalizeSetup(
    {
      kind: 'swing',
      opening: { width: 900, height: 2060, depth: 80, floorGap: 10 },
      openSide: 'right-outside',
      frameVariant: 'withJumper',
      frame: 'standart51',
      door: 'technoform40',
      isNoDoor: false,
      hingeSku: 'hinge3D1',
      isHingeIncut: false,
      frameCoverSku: 'blackMate',
      doorCoverSku: 'blackMate',
      inserts: {},
      handle: { handleSku: null },
      margin: 0,
      discount: 0,
    },
    data
  );
}
