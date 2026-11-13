/** Оформление чертежей дверей: цвета слоёв (для SVG/DXF) и размеры аннотаций, мм на бумаге */
export const DRAW = {
  line: '#0f172a',
  lineThin: '#475569',
  frame: '#64748b',
  frameFill: '#cbd5e1',
  glass: '#e0f2f4',
  decor: '#1e293b',
  opening: '#475569',
  hinge: '#b45309',
  tube: '#1f2937',
  wall: '#94a3b8',
  dim: '#0284c7',
  dimText: '#0369a1',
  warn: '#dc2626',
} as const;

export const PAPER = {
  title: 7,
  subtitle: 5,
  dim: 3.5,
  note: 3.5,
  small: 3,
  dimFirst: 10,
  dimStep: 9,
} as const;

/** Слои */
export const L = {
  outline: 'Контур',
  thin: 'Тонкие',
  frame: 'Обрамление',
  glass: 'Стекло',
  decor: 'Декор',
  opening: 'Открывание',
  hardware: 'Фурнитура',
  plan: 'План',
  tube: 'Трубы',
  wall: 'Стена',
  dimensions: 'Размеры',
  notes: 'Надписи',
  table: 'Таблица',
} as const;

export const S = {
  text: 'GOST',
  dimText: 'Размеры',
  dim: 'Двери',
} as const;

/** Масштаб по наибольшему габариту: крупные проекты мельче, чтобы текст не терялся */
export function pickScale(extentMm: number): string {
  if (extentMm > 9000) {
    return '1:50';
  }
  if (extentMm > 4500) {
    return '1:25';
  }
  return '1:20';
}
