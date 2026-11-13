import { toNumber } from './legacy/num';

import type { LegacyData } from './legacy/legacy-data';
import type { ConfigRow } from './legacy/types';

/** Тип изделия семейства дверей (param.type легаси) */
export const DoorKind = {
  SWING: 'swing',
  BIVALVE: 'bivalve',
} as const;
export type DoorKind = (typeof DoorKind)[keyof typeof DoorKind];

/** Вариант открывания: сторона петель × направление */
export const OpenSide = {
  RIGHT_OUTSIDE: 'right-outside',
  LEFT_OUTSIDE: 'left-outside',
  RIGHT_INSIDE: 'right-inside',
  LEFT_INSIDE: 'left-inside',
} as const;
export type OpenSide = (typeof OpenSide)[keyof typeof OpenSide];

/** Конструкция короба */
export const FrameVariant = {
  WITH_JUMPER: 'withJumper',
  NO_JUMPER: 'noJumper',
  NO_FRAME: 'noFrame',
} as const;
export type FrameVariant = (typeof FrameVariant)[keyof typeof FrameVariant];

export type DecorSide = 'front' | 'back';

/** Отделка стороны полотна: стекло/вставка из прайса (вся плоскость полотна) */
export type LeafInsert = {
  sku: string;
  /** Цвет окантовки прозрачного стекла (TF/Spazio) */
  borderSku?: string;
};

/** Ручка и замок полотна */
export type HandleChoice = {
  /** id ручки из прайса; null — без ручки */
  handleSku: string | null;
  /** Тип замка (agb, bonaiti, krona…) */
  lockType?: string;
  /** Конкретный замок (цвет) */
  lockSku?: string;
  /** Личинка (key-key, key-wrap) */
  larvaType?: string;
  larvaSide?: string;
};

/** Входные параметры двери: то, что выбирает менеджер */
export type DoorSetup = {
  kind: DoorKind;
  opening: { width: number; height: number; depth: number; floorGap: number };
  openSide: OpenSide;
  frameVariant: FrameVariant;
  /** Короб (frameSelect): standart51, modula51, monoblock, monoblock-b */
  frame: string;
  /** Полотно (doorSelect): technoform40, technoform51, spaziosg… */
  door: string;
  /** Без полотна: только короб под выбранное полотно */
  isNoDoor: boolean;
  hingeSku: string;
  /** Врезка петель вместо петель (без короба / без полотна) */
  isHingeIncut: boolean;
  frameCoverSku: string;
  doorCoverSku: string;
  inserts: Partial<Record<DecorSide, LeafInsert>>;
  handle: HandleChoice;
  /** Наценка и скидка менеджера, % (на группы короба и полотна) */
  margin: number;
  discount: number;
};

/** Производные ключи легаси (frameType, framePart, doorPart, doorMaterial…) */
export type DoorKeys = {
  frameType: string;
  framePart: string;
  doorType: string;
  doorPart: string;
  /** Ключ списания полотна (getDoorPartKey) */
  doorPartKey: string;
  doorMaterial: 'alum' | 'mdf';
  frameJumper: boolean;
  isNoFrame: boolean;
  decorSides: DecorSide[];
  hingeGroup: string;
  /** hidden | overhead */
  hingeKind: string;
  frameConfig: Record<string, ConfigRow>;
  doorConfig: Record<string, ConfigRow>;
  /** Списание полотна по общему ключу */
  doorPartConfig: Record<string, ConfigRow>;
};

/** getDoorPartKey легаси: общие калькуляторы для близких полотен */
export function getDoorPartKey(doorPart: string): string {
  switch (doorPart) {
    case 'technoform40Part':
    case 'technoform40pivotPart':
    case 'technoform51Part':
      return 'technoform40Part';
    case 'spazioltsgPart':
      return 'spaziosgPart';
    case 'dfedgekPart':
      return 'dfedgePart';
    case 'df60kPart':
      return 'df60Part';
    case 'fondo51kPart':
      return 'fondo51Part';
    case 'spazioltslPart':
      return 'spazioslPart';
    case 'technoform51slPart':
    case 'technoform40magicPart':
      return 'technoform40slPart';
    case 'fondo40kmagicPart':
    case 'fondo40magicPart':
    case 'fondo40kslPart':
      return 'fondo40slPart';
    default:
      return doorPart;
  }
}

export function resolveKeys(setup: DoorSetup, data: LegacyData): DoorKeys {
  const frameType = setup.frame.toLowerCase();
  const doorType = setup.door.toLowerCase();
  const framePart = `${frameType}Part`;
  const doorPart = `${doorType}Part`;
  const doorPartKey = getDoorPartKey(doorPart);
  const doorConfig = data.part(doorPart);
  const hinge = data.price(setup.hingeSku);
  const decorCount = toNumber(doorConfig.decorCount?.value) || 1;

  return {
    frameType,
    framePart,
    doorType,
    doorPart,
    doorPartKey,
    doorMaterial: data.config(setup.door)?.param1 === 'mdf' ? 'mdf' : 'alum',
    frameJumper: setup.frameVariant !== FrameVariant.NO_JUMPER,
    isNoFrame: setup.frameVariant === FrameVariant.NO_FRAME,
    decorSides: decorCount === 2 ? ['front', 'back'] : ['front'],
    hingeGroup: hinge?.type ?? '',
    hingeKind: hinge?.param2 ?? 'hidden',
    frameConfig: data.part(framePart),
    doorConfig,
    doorPartConfig: data.part(doorPartKey),
  };
}
