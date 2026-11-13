import { pickScale } from '../config/drawing-style';

import { buildFacade } from './build-facade';
import { buildSpec } from './build-spec';
import { DoorDrawing } from './door-drawing';

import type { DoorSetup, LegacyData } from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';
import type { CadDocument } from 'cad-blueprint';

export type DrawingSheet = { id: string; title: string };

export const DRAWING_SHEETS: DrawingSheet[] = [
  { id: 'outside', title: 'Фасад снаружи' },
  { id: 'inside', title: 'Фасад изнутри' },
  { id: 'spec', title: 'Спецификация' },
];

/** Чертежи двери одним документом cad-blueprint (SVG, DXF, .vcad) */
export function buildDoorDrawings(
  setup: DoorSetup,
  result: SwingResult,
  data: LegacyData
): CadDocument {
  const d = new DoorDrawing(
    pickScale(Math.max(setup.opening.width, setup.opening.height))
  );
  d.doc.addSheet(
    'Фасад снаружи',
    buildFacade(d, setup, result, data, 'outside'),
    'outside'
  );
  d.doc.addSheet(
    'Фасад изнутри',
    buildFacade(d, setup, result, data, 'inside'),
    'inside'
  );
  d.doc.addSheet('Спецификация', buildSpec(d, result), 'spec');
  return d.doc;
}
