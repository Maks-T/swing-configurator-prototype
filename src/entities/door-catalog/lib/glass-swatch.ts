import type { PriceRow } from '@calculation/door-kit';

type CatalogProduct = Pick<PriceRow, 'name'>;

/** Как рисовать стекло, пока у каталога нет текстур: цвет + характер поверхности */
export type GlassSwatch = {
  color: string;
  pattern: 'clear' | 'satin' | 'mirror' | 'ribbed' | 'mesh' | 'palette' | 'solid';
};

/**
 * Палитра Colour 01–12 (крашеные стёкла и триплекс). Значения сняты с превью
 * легаси на глаз: это моковые цвета до загрузки текстур из каталога.
 */
const COLOUR_PALETTE: Record<string, string> = {
  '01': '#f7f7f4',
  '02': '#eee9dc',
  '03': '#dfd8c5',
  '04': '#b5b5ac',
  '05': '#a49a7d',
  '06': '#8a8b94',
  '07': '#6c5f52',
  '08': '#256176',
  '09': '#566355',
  '10': '#523d2f',
  '11': '#4e5159',
  '12': '#0f1013',
};

const TINTS: [RegExp, string][] = [
  [/dark grafite/i, '#43484b'],
  [/grafite|graphite|grey/i, '#7d8286'],
  [/bronz/i, '#b89d7d'],
  [/bianco/i, '#f1f1ee'],
  [/clearvision/i, '#eef6f6'],
];

function tintOf(name: string, fallback: string): string {
  return TINTS.find(([re]) => re.test(name))?.[1] ?? fallback;
}

/** Образец стекла по названию и группе каталога */
export function getGlassSwatch(product: CatalogProduct | undefined): GlassSwatch {
  if (!product) {
    return { color: '#dcebee', pattern: 'clear' };
  }
  const name = product.name;
  if (/\b(ral|ncs)\b/i.test(name)) {
    return { color: '#c9c9c9', pattern: 'palette' };
  }
  if (/mirror/i.test(name)) {
    return { color: tintOf(name, '#c9ced2'), pattern: 'mirror' };
  }
  if (/сетк/i.test(name)) {
    return { color: tintOf(name, '#dcebee'), pattern: 'mesh' };
  }
  if (/line|moru|flutelite/i.test(name)) {
    return { color: tintOf(name, '#e3eeef'), pattern: 'ribbed' };
  }
  const colour = /colour[^0-9]*(\d{2})/i.exec(name);
  if (colour?.[1]) {
    return {
      color: COLOUR_PALETTE[colour[1]] ?? '#cccccc',
      pattern: /matt/i.test(name) ? 'satin' : 'solid',
    };
  }
  if (/satinato/i.test(name)) {
    return { color: tintOf(name, '#eeeeec'), pattern: 'satin' };
  }
  return { color: tintOf(name, '#dcebee'), pattern: 'clear' };
}
