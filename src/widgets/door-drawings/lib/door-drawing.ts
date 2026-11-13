import {
  CadDocument,
  circle,
  entitiesBounds,
  mtext,
  rect,
  text,
  type Entity,
  type EntityFill,
  type Point2,
  type TextAnchor,
} from 'cad-blueprint';

import { DRAW, L, PAPER, S } from '../config/drawing-style';

type NoteOptions = {
  height?: number;
  anchor?: TextAnchor;
  color?: string;
  layer?: string;
  rotationDeg?: number;
};

/**
 * Документ чертежей дверей с настроенными слоями и стилями и помощники
 * построителей листов. Модель в мм, система координат cartesian (Y вверх).
 */
export class DoorDrawing {
  readonly doc: CadDocument;

  constructor(scale: string) {
    this.doc = new CadDocument({
      gost: true,
      settings: { scale, precision: 0, padding: 10 },
    });
    const ls = this.doc.layers;
    ls.create(L.outline, { color: DRAW.line, lineWeight: 0.5 });
    ls.create(L.thin, { color: DRAW.lineThin, lineWeight: 0.25 });
    ls.create(L.frame, { color: DRAW.frame, lineWeight: 0.35 });
    ls.create(L.glass, { color: DRAW.lineThin, lineWeight: 0.18 });
    ls.create(L.decor, { color: DRAW.decor, lineWeight: 0.25 });
    ls.create(L.opening, { color: DRAW.opening, lineWeight: 0.18 });
    ls.create(L.hardware, { color: DRAW.hinge, lineWeight: 0.35 });
    ls.create(L.plan, { color: DRAW.line, lineWeight: 0.5 });
    ls.create(L.tube, { color: DRAW.tube, lineWeight: 0.5 });
    ls.create(L.wall, { color: DRAW.wall, lineWeight: 0.5, lineType: 'dashed' });
    ls.create(L.dimensions, { color: DRAW.dim, lineWeight: 0.18 });
    ls.create(L.notes, { color: DRAW.line, lineWeight: 0.25 });
    ls.create(L.table, { color: DRAW.line, lineWeight: 0.25 });

    this.doc.textStyles.clone(S.text, S.dimText, { height: PAPER.dim });
    this.doc.dimStyles.clone('GOST', S.dim, {
      textStyle: S.dimText,
      terminatorSize: 2.5,
      lineColor: DRAW.dim,
      textColor: DRAW.dimText,
    });
    this.doc.dimStyles.setCurrent(S.dim);
  }

  /** Мм на бумаге → мм модели */
  a(paperMm: number): number {
    return this.doc.drawing.annotationToModel(paperMm);
  }

  box(
    layer: string,
    x: number,
    y: number,
    w: number,
    h: number,
    fill: EntityFill | null = null
  ): Entity | null {
    if (w <= 0 || h <= 0) {
      return null;
    }
    return rect(x, y, w, h, { layer, ...(fill ? { fill } : {}) });
  }

  note(position: Point2, value: string, options: NoteOptions = {}): Entity {
    const make = value.includes('\n') ? mtext : text;
    return make(position, value, {
      layer: options.layer ?? L.notes,
      style: S.text,
      height: options.height ?? PAPER.note,
      anchor: options.anchor ?? 'bottom-left',
      ...(options.color ? { color: options.color } : {}),
      ...(options.rotationDeg ? { rotationDeg: options.rotationDeg } : {}),
    });
  }

  /** Номер позиции в кружке (как в смете и спецификации) */
  marker(position: Point2, value: string, layer: string = L.notes): Entity[] {
    return [
      circle(position, this.a(4), { layer, fill: '#ffffff' }),
      this.note(position, value, { anchor: 'middle-center', layer, height: PAPER.note }),
    ];
  }

  /** Заголовок над содержимым и подпись под ним */
  withTitle(entities: Entity[], title: string, subtitle?: string): Entity[] {
    const b = entitiesBounds(entities, this.doc.context());
    if (!Number.isFinite(b.minX)) {
      return entities;
    }
    const cx = (b.minX + b.maxX) / 2;
    const out = [
      ...entities,
      this.note([cx, b.maxY + this.a(6)], title, {
        height: PAPER.title,
        anchor: 'bottom-center',
      }),
    ];
    if (subtitle) {
      out.push(
        this.note([b.minX, b.minY - this.a(6)], subtitle, {
          anchor: 'top-left',
          color: DRAW.lineThin,
        })
      );
    }
    return out;
  }
}
