/*
|--------------------------------------------------------------------------
| Таблицы легаси ConfigDoor «как их видит калькулятор»
|--------------------------------------------------------------------------
|
| Повторяет public/public.php + store/List.ts легаси:
|  - те же файлы и тот же порядок склейки (порядок влияет на ключи дублей);
|  - те же колонки по группам файлов (лишние колонки не грузим, иначе
|    getByParam в ядре начнёт совпадать иначе, чем в легаси);
|  - value из value_ru, name из name_ru;
|  - строки без id отбрасываются (PHP array_filter);
|  - у строк trim и снятие префиксов c_ (List) и d_ (PHP loadCSV);
|  - типизированные колонки: float/int как в PHP csvTypeConvert;
|  - дубль id получает суффикс индекса строки в склеенном массиве (List).
|
*/

import fs from 'node:fs';
import path from 'node:path';

import { tokenizeCsv } from './parser.js';

/** Группы конфигов: файлы (порядок важен) и колонки, которые грузит PHP */
const CONFIG_GROUPS = [
  {
    files: ['config/c_00_global.csv'],
    columns: ['id', 'key', 'type', 'param1', 'value'],
  },
  {
    files: ['c_00_margin.csv'],
    columns: [
      'id',
      'key',
      'type',
      ...Array.from({ length: 15 }, (_, i) => `param${i + 1}`),
      'value',
    ],
  },
  {
    files: [
      'c_00_time.csv',
      'config/c_50_matrix.csv',
      'config/c_51_handle_matrix.csv',
      'config/book-system/c_book-matrix.csv',
    ],
    columns: ['id', 'key', 'type', 'param1', 'value'],
  },
  {
    files: [
      'config/c_10_frame.csv',
      'config/c_11_door.csv',
      'config/c_20_slide.csv',
      'config/c_21_door.csv',
      'config/book-system/c_book-door.csv',
      'config/c_22_slide_decor.csv',
      'config/c_23_slide_sync.csv',
      'config/c_25_handle.csv',
      'config/c_60_offer.csv',
      'config/c_70_door_sizes.csv',
      'config/c_71_bivalve_sizes.csv',
      'config/c_80_hinge_count.csv',
      'config/c_110_jamb.csv',
    ],
    columns: ['id', 'key', 'param1', 'param2', 'param3', 'param4', 'param5', 'value'],
    floatValue: true,
  },
  {
    files: ['config/c_40_decor.csv'],
    columns: ['id', 'key', 'param1', 'param2', 'param3', 'param4', 'param5', 'param6'],
  },
];

const PRICE_COLUMNS = [
  'id',
  'type',
  'group',
  'name',
  'image',
  'param1',
  'param2',
  'param3',
  'param4',
  'param5',
  'param6',
  'height',
  'width',
  'weight',
  'unit',
  'priceIn',
  'priceEUR',
  'priceUSD',
  'priceRUB',
  'priceBYN',
  'pricePLN',
];
const PRICE_INT = new Set(['height', 'width']);
const PRICE_FLOAT = new Set([
  'weight',
  'priceIn',
  'priceEUR',
  'priceUSD',
  'priceRUB',
  'priceBYN',
  'pricePLN',
]);

const phpFloat = (value) => {
  const n = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
const phpInt = (value) => {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : 0;
};

/** Строковая ячейка как её видит калькулятор: trim, снять d_ (PHP) и c_ (List) */
const cleanString = (value) =>
  String(value ?? '')
    .trim()
    .replace(/^d_/, '')
    .trim()
    .replace(/^c_/i, '');

/** Индекс колонки по имени: точное совпадение, затем с переводом _ru, затем без звёздочки */
function columnIndex(header, name, strict) {
  const clean = header.map((h) => h.replace(/\*$/, '').trim());
  const variants = name === 'value' || name === 'name' ? [`${name}_ru`, name] : [name];
  for (const variant of variants) {
    const exact = clean.indexOf(variant);
    if (exact !== -1) {
      return exact;
    }
  }
  if (!strict) {
    const loose = clean.findIndex((h) => h.toLowerCase().startsWith(name.toLowerCase()));
    if (loose !== -1) {
      return loose;
    }
  }
  return -1;
}

function readRows(
  csvDir,
  file,
  columns,
  { floatValue = false, strict = false, isPrice = false } = {}
) {
  const filePath = path.join(csvDir, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV-файл не найден: ${filePath}`);
  }
  const rows = tokenizeCsv(fs.readFileSync(filePath, 'utf8'));
  const header = rows[0] ?? [];
  const indexes = columns
    .map((c) => [c, columnIndex(header, c, strict)])
    .filter(([, i]) => i !== -1);
  const out = [];

  for (const row of rows.slice(1)) {
    const record = {};
    for (const [name, i] of indexes) {
      const raw = row[i] ?? '';
      if (isPrice && PRICE_INT.has(name)) {
        record[name] = phpInt(raw);
      } else if (isPrice && PRICE_FLOAT.has(name)) {
        record[name] = phpFloat(raw);
      } else if (floatValue && name === 'value') {
        record[name] = phpFloat(raw);
      } else {
        record[name] = cleanString(raw);
      }
    }
    if (record.id) {
      out.push({ ...record, source: file });
    }
  }
  return out;
}

/** Ключи как в List: дубль id → id + индекс строки в склеенном массиве */
function withListKeys(rows) {
  const used = new Set();
  return rows.map((row, index) => {
    let key = row.id;
    if (used.has(key)) {
      key += String(index);
    }
    used.add(key);
    return { key, row };
  });
}

/** Склеенный конфиг калькулятора */
export function loadConfigRows(csvDir) {
  const rows = CONFIG_GROUPS.flatMap((group) =>
    group.files
      .filter(
        (file) =>
          fs.existsSync(path.join(csvDir, file)) || !file.startsWith('config/book-system')
      )
      .flatMap((file) =>
        readRows(csvDir, file, group.columns, { floatValue: group.floatValue })
      )
  );
  return withListKeys(rows);
}

/** Склеенный прайс: все p_*.csv в порядке scandir (по алфавиту) */
export function loadPriceRows(csvDir) {
  const dir = path.join(csvDir, 'price');
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.csv'))
    .sort();
  const rows = files.flatMap((file) =>
    readRows(csvDir, `price/${file}`, PRICE_COLUMNS, { strict: true, isPrice: true })
  );
  return withListKeys(rows);
}
