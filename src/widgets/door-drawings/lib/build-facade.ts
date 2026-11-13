import { dimLinear, line, type Entity } from 'cad-blueprint';

import {
  buildFacadeGeometry,
  type DoorSetup,
  type FacadeView,
  type LegacyData,
} from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

import { DRAW, L, PAPER } from '../config/drawing-style';

import type { DoorDrawing } from './door-drawing';

const TITLE: Record<FacadeView, string> = {
  outside: 'Фасад. Вид снаружи',
  inside: 'Фасад. Вид изнутри',
};

/**
 * Фасад двери: стена, короб (стойки и перемычка), полотно и зона стекла,
 * условное открывание (ГОСТ 21.501: вершина у ручки, штрих — от зрителя),
 * петли, ручка, размеры проёма, короба и полотна.
 */
export function buildFacade(
  d: DoorDrawing,
  setup: DoorSetup,
  result: SwingResult,
  data: LegacyData,
  view: FacadeView
): Entity[] {
  const g = buildFacadeGeometry(setup, result.sizes, result.hingeCount, view);
  const W = g.opening.width;
  const H = g.opening.height;
  const out: (Entity | null)[] = [];

  out.push(line([-d.a(8), 0], [W + d.a(8), 0], { layer: L.outline }));
  out.push(
    line([0, 0], [0, H], { layer: L.wall }),
    line([W, 0], [W, H], { layer: L.wall }),
    line([0, H], [W, H], { layer: L.wall })
  );
  g.frameBars.forEach((bar) => {
    out.push(d.box(L.frame, bar.x, bar.y, bar.width, bar.height, DRAW.frameFill));
  });

  const { leaf } = g;
  if (leaf) {
    out.push(d.box(L.outline, leaf.x, leaf.y, leaf.width, leaf.height));
    const hasGlass = Boolean(setup.inserts.front ?? setup.inserts.back);
    out.push(
      d.box(
        L.glass,
        leaf.inner.x,
        leaf.inner.y,
        leaf.inner.width,
        leaf.inner.height,
        hasGlass ? DRAW.glass : null
      )
    );
    const hx = leaf.hingeSide === 'right' ? leaf.x + leaf.width : leaf.x;
    const ax = leaf.hingeSide === 'right' ? leaf.x : leaf.x + leaf.width;
    const dash = leaf.isAway ? { lineType: 'dashed' as const } : {};
    out.push(
      line([hx, leaf.y + leaf.height], [ax, leaf.y + leaf.height / 2], {
        layer: L.opening,
        ...dash,
      }),
      line([ax, leaf.y + leaf.height / 2], [hx, leaf.y], { layer: L.opening, ...dash })
    );
    leaf.hinges.forEach((h) => {
      out.push(d.box(L.hardware, h.x, h.y, h.width, h.height, 'solid'));
    });
    if (leaf.handle) {
      out.push(
        d.box(
          L.hardware,
          leaf.handle.x,
          leaf.handle.y,
          leaf.handle.width,
          leaf.handle.height,
          'solid'
        )
      );
    }
    out.push(
      dimLinear([leaf.x, leaf.y], [leaf.x + leaf.width, leaf.y], {
        direction: 'horizontal',
        at: [0, leaf.y + d.a(PAPER.dimFirst)],
        layer: L.dimensions,
      }),
      dimLinear(
        [leaf.x + leaf.width, leaf.y],
        [leaf.x + leaf.width, leaf.y + leaf.height],
        {
          direction: 'vertical',
          at: [leaf.x + leaf.width - d.a(PAPER.dimFirst), 0],
          layer: L.dimensions,
        }
      )
    );
  }

  if (g.frame) {
    const f = g.frame;
    out.push(
      dimLinear([f.x, f.height], [f.x + f.width, f.height], {
        direction: 'horizontal',
        at: [0, H + d.a(PAPER.dimFirst)],
        layer: L.dimensions,
      }),
      dimLinear([W, 0], [W, f.height], {
        direction: 'vertical',
        at: [W + d.a(PAPER.dimFirst), 0],
        layer: L.dimensions,
      })
    );
  }
  out.push(
    dimLinear([0, 0], [W, 0], {
      direction: 'horizontal',
      at: [0, -d.a(PAPER.dimFirst)],
      layer: L.dimensions,
    }),
    dimLinear([0, 0], [0, H], {
      direction: 'vertical',
      at: [-d.a(PAPER.dimFirst), 0],
      layer: L.dimensions,
    })
  );

  const name = (sku: string) => data.price(sku)?.name ?? sku;
  const frameName = String(data.config(setup.frame)?.value ?? setup.frame);
  const doorName = setup.isNoDoor
    ? 'без полотна'
    : String(data.config(setup.door)?.value ?? setup.door);
  return d.withTitle(
    out.filter((e): e is Entity => e !== null),
    TITLE[view],
    `${setup.frameVariant === 'noFrame' ? 'Без короба' : frameName} · полотно ${doorName} · покрытие ${name(setup.frameCoverSku)}\nПетель ${result.hingeCount}. Размеры: проём, короб (снаружи), полотно (внутри). Штрих — открывание от зрителя.`
  );
}
