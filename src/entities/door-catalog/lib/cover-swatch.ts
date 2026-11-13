/**
 * Цвет образца покрытия профиля по названию (моковые цвета, пока в прайсе нет HEX).
 * RAL — по таблице популярных кодов, остальное — по ключевым словам.
 */
const RAL: Record<string, string> = {
  '9005': '#0e0e10',
  '9010': '#f1ece1',
  '9016': '#f1f0ea',
  '9003': '#ecece7',
  '7016': '#383e42',
  '7024': '#45494e',
  '7035': '#c5c7c4',
  '7040': '#9da3a6',
  '8017': '#45322e',
  '8019': '#3f3a3a',
  '1013': '#e3d9c6',
  '3004': '#6b1c23',
  '5011': '#1a2b3c',
  '6005': '#0f4336',
};

const WORDS: [RegExp, string][] = [
  [/black|черн/i, '#1c1c1e'],
  [/white|бел/i, '#f2f1ec'],
  [/silver|серебр|натур/i, '#c4c6c8'],
  [/gold|золот|champ|шамп/i, '#c9a85d'],
  [/bronz|бронз/i, '#8c6a43'],
  [/graphit|графит|grey|gray|сер/i, '#5d6064'],
  [/brown|коричн/i, '#5a4032'],
];

/** Семейство RAL по первой цифре: для кодов вне таблицы */
const RAL_FAMILY: Record<string, string> = {
  '1': '#d6b24a',
  '2': '#d9762b',
  '3': '#a3262a',
  '4': '#7b4a7a',
  '5': '#2f5590',
  '6': '#3d6b45',
  '7': '#7d8287',
  '8': '#6b4a35',
  '9': '#e9e7e0',
};

export function getCoverColor(name: string): string {
  const ral = /(\d{4})/.exec(name)?.[1];
  if (ral && RAL[ral]) {
    return RAL[ral];
  }
  if (ral && /ral/i.test(name)) {
    return RAL_FAMILY[ral[0] ?? ''] ?? '#8c8f93';
  }
  return WORDS.find(([re]) => re.test(name))?.[1] ?? '#8c8f93';
}
