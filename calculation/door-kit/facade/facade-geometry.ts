import type { DoorSetup } from '../setup';
import type { DoorSizes } from '../sizes';

/** Прямоугольник в мм, начало — левый нижний угол проёма, Y вверх (как на чертеже) */
export type Box = { x: number; y: number; width: number; height: number };

export type FacadeView = 'outside' | 'inside';

export type FacadeLeaf = Box & {
  /** Сторона петель на этом виде */
  hingeSide: 'left' | 'right';
  /** Полотно открывается от зрителя (на чертеже — штрих) */
  isAway: boolean;
  /** Зона заполнения (стекло) внутри профиля полотна */
  inner: Box;
  hinges: Box[];
  handle: Box | null;
};

export type FacadeGeometry = {
  view: FacadeView;
  opening: Box;
  /** Профили короба: стойки и перемычка (пусто без короба) */
  frameBars: Box[];
  /** Наружный контур короба */
  frame: Box | null;
  leaf: FacadeLeaf | null;
};

const HINGE = { width: 16, height: 100, fromEnd: 250 } as const;
const HANDLE = { width: 22, height: 160, fromEdge: 50, fromFloor: 1000 } as const;

/** Позиции петель по высоте: первая и последняя в 250 мм от торцов, остальные равномерно */
export function hingeCenters(leafY: number, leafH: number, count: number): number[] {
  if (count <= 0) {
    return [];
  }
  const top = leafY + leafH - HINGE.fromEnd;
  const bottom = leafY + HINGE.fromEnd;
  if (count === 1) {
    return [leafY + leafH / 2];
  }
  const step = (top - bottom) / (count - 1);
  return Array.from({ length: count }, (_, i) => top - step * i);
}

/**
 * Геометрия фасада распашной двери в мм для холста и чертежей: проём, короб
 * (стойки + перемычка), полотно с зоной стекла, петли и ручка. Вид изнутри
 * зеркален: петли меняют сторону, направление открывания — обратное.
 */
export function buildFacadeGeometry(
  setup: DoorSetup,
  sizes: DoorSizes,
  hingeCount: number,
  view: FacadeView
): FacadeGeometry {
  const W = setup.opening.width;
  const H = setup.opening.height;
  const hasFrame = setup.frameVariant !== 'noFrame' && sizes.frameWidth > 0;
  const hasJumper = setup.frameVariant === 'withJumper';
  const p = sizes.frameProfileWidth;
  const fx = (W - sizes.frameWidth) / 2;
  const frame: Box | null = hasFrame
    ? { x: fx, y: 0, width: sizes.frameWidth, height: sizes.frameHeight }
    : null;

  const frameBars: Box[] = frame
    ? [
        { x: frame.x, y: 0, width: p, height: frame.height },
        { x: frame.x + frame.width - p, y: 0, width: p, height: frame.height },
        ...(hasJumper
          ? [
              {
                x: frame.x + p,
                y: frame.height - p,
                width: frame.width - 2 * p,
                height: p,
              },
            ]
          : []),
      ]
    : [];

  const size = sizes.doors[0];
  let leaf: FacadeLeaf | null = null;
  if (!setup.isNoDoor && size && size.width > 0 && size.height > 0) {
    const x = (W - size.width) / 2;
    const y = setup.opening.floorGap;
    const isRight = setup.openSide.startsWith('right');
    const isOutside = setup.openSide.endsWith('outside');
    const hingeSide: 'left' | 'right' =
      (view === 'outside') === isRight ? 'right' : 'left';
    const pv = sizes.doorProfileWidthV;
    const ph = sizes.doorProfileWidthH;
    const hx =
      hingeSide === 'right' ? x + size.width - HINGE.width / 2 : x - HINGE.width / 2;
    leaf = {
      x,
      y,
      width: size.width,
      height: size.height,
      hingeSide,
      // Наружу — к зрителю снаружи; изнутри наоборот
      isAway: (view === 'outside') !== isOutside,
      inner: {
        x: x + pv,
        y: y + ph,
        width: Math.max(0, size.width - 2 * pv),
        height: Math.max(0, size.height - 2 * ph),
      },
      hinges: hingeCenters(y, size.height, hingeCount).map((cy) => ({
        x: hx,
        y: cy - HINGE.height / 2,
        width: HINGE.width,
        height: HINGE.height,
      })),
      handle: setup.handle.handleSku
        ? {
            x:
              hingeSide === 'right'
                ? x + HANDLE.fromEdge - HANDLE.width / 2
                : x + size.width - HANDLE.fromEdge - HANDLE.width / 2,
            y:
              Math.min(HANDLE.fromFloor, y + size.height - HANDLE.height) -
              HANDLE.height / 2,
            width: HANDLE.width,
            height: HANDLE.height,
          }
        : null,
    };
  }

  return { view, opening: { x: 0, y: 0, width: W, height: H }, frameBars, frame, leaf };
}
