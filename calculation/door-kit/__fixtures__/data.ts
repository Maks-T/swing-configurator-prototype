import importData from '../../../import/import_data.json';
import { legacyDataFromImport, type DoorImportData } from '../legacy/from-import';

import type { DoorSetup } from '../setup';

/** Данные легаси для тестов (сгенерированы tools/door-importer из CSV легаси) */
export const TEST_DATA = legacyDataFromImport(importData as unknown as DoorImportData);

/** Дверь со скриншота легаси: Standart 51 + TECHNOFORM, 900×2060 */
export const EXAMPLE_SETUP: DoorSetup = {
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
};
