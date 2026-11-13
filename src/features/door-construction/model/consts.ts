import { FrameVariant, OpenSide } from '@calculation/door-kit';

export const OPEN_SIDES: { id: OpenSide; title: string; hint: string }[] = [
  { id: OpenSide.RIGHT_OUTSIDE, title: 'Правое', hint: 'наружу' },
  { id: OpenSide.LEFT_OUTSIDE, title: 'Левое', hint: 'наружу' },
  { id: OpenSide.RIGHT_INSIDE, title: 'Правое', hint: 'внутрь' },
  { id: OpenSide.LEFT_INSIDE, title: 'Левое', hint: 'внутрь' },
];

export const FRAME_VARIANTS: { id: FrameVariant; title: string; hint: string }[] = [
  {
    id: FrameVariant.WITH_JUMPER,
    title: 'С перемычкой',
    hint: 'стойки и верхняя перемычка',
  },
  {
    id: FrameVariant.NO_JUMPER,
    title: 'Без перемычки',
    hint: 'две стойки, полотно в полную высоту',
  },
  { id: FrameVariant.NO_FRAME, title: 'Без короба', hint: 'полотно на петлях к стене' },
];
