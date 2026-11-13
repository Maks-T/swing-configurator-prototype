import { line, type Entity } from 'cad-blueprint';

import { flattenEstimate } from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

import { L, PAPER } from '../config/drawing-style';

import type { DoorDrawing } from './door-drawing';

type Column = { title: string; width: number };

/** Колонки, ширина в мм бумаги */
const COLUMNS: Column[] = [
  { title: '№', width: 10 },
  { title: 'Артикул', width: 34 },
  { title: 'Наименование', width: 120 },
  { title: 'Кол-во', width: 20 },
  { title: 'Ед.', width: 14 },
];

const ROW = 8;

/** Спецификация комплектации: позиции сметы по группам короба и полотна */
export function buildSpec(d: DoorDrawing, result: SwingResult): Entity[] {
  const rows: string[][] = [];
  result.estimate.children.forEach((group) => {
    rows.push([
      '',
      '',
      group.prefix ? `${group.prefix}: ${group.name}` : group.name,
      '',
      '',
    ]);
    flattenEstimate(group)
      .filter((n) => n !== group && n.children.length === 0)
      .forEach((n) => {
        rows.push([String(rows.length), n.sku ?? '', n.name, String(n.qty), n.unit]);
      });
  });

  const k = d.a(1);
  const total = COLUMNS.reduce((acc, c) => acc + c.width, 0) * k;
  const all = [COLUMNS.map((c) => c.title), ...rows];
  const height = all.length * ROW * k;
  const out: Entity[] = [];

  all.forEach((cells, r) => {
    const top = -r * ROW * k;
    out.push(
      line([0, top], [total, top], { layer: L.table, lineWeight: r <= 1 ? 0.5 : 0.18 })
    );
    let x = 0;
    cells.forEach((value, c) => {
      const col = COLUMNS[c];
      if (!col) {
        return;
      }
      // Длинные названия режем, чтобы не вылезать за колонку
      const max = Math.floor(col.width / 1.9);
      out.push(
        d.note(
          [x + 1.5 * k, top - (ROW / 2) * k],
          value.length > max ? `${value.slice(0, max - 1)}…` : value,
          {
            anchor: 'middle-left',
            height: PAPER.small,
            layer: L.table,
          }
        )
      );
      x += col.width * k;
    });
  });
  out.push(line([0, -height], [total, -height], { layer: L.table, lineWeight: 0.5 }));
  out.push(line([0, 0], [0, -height], { layer: L.table, lineWeight: 0.5 }));
  let x = 0;
  COLUMNS.forEach((col) => {
    x += col.width * k;
    out.push(line([x, 0], [x, -height], { layer: L.table, lineWeight: 0.18 }));
  });

  return d.withTitle(
    out,
    'Спецификация комплектации',
    'Количество — по смете (м.п., шт, кг).'
  );
}
