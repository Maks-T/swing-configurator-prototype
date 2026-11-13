/*
|--------------------------------------------------------------------------
| door-importer: CSV ConfigDoor → import_data.json (формат Nicole Core)
|--------------------------------------------------------------------------
|
| Запуск:
|   node tools/door-importer/index.js <путь к configdoor/shared/csv>
|
| Прототип хранит прайс и конфиг легаси «как видит калькулятор» (см.
| src/legacy-tables.js): товары — products, строки конфигурации — словарь
| door_legacy_config. Так расчёт ядра повторяет легаси 1:1 и сверяется на
| реальных заказах. Нормализация в предметные справочники — следующий шаг.
|
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfigRows, loadPriceRows } from './src/legacy-tables.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const csvDir = path.resolve(
  process.argv[2] ?? process.env.CONFIGDOOR_CSV_DIR ?? '../configdoor/shared/csv'
);
const PREFIX = 'dr';

const priceRows = loadPriceRows(csvDir);
const configRows = loadConfigRows(csvDir);

const typeCode = (type) =>
  `type_${PREFIX}_${(type || 'misc').replace(/[^a-zA-Z0-9-]+/g, '_')}`;

const types = [...new Set(priceRows.map(({ row }) => typeCode(row.type)))].map(
  (code) => ({
    code,
    name: { ru: code, en: code },
  })
);

const products = priceRows.map(({ key, row }, index) => ({
  external_code: `sku_${PREFIX}_${key}`,
  product_type_external_code: typeCode(row.type),
  category_external_code: `cat_${PREFIX}_${row.source.replace(/^price\/|\.csv$/g, '')}`,
  catalog_type: 'item',
  unit_code: row.unit || 'шт',
  code: key,
  slug: key,
  name: { ru: row.name, en: row.name },
  is_active: true,
  eav: { legacy: row, sort_order: index },
  variants: [
    {
      sku: key,
      price: row.priceEUR ?? 0,
      cost_price: row.priceIn ?? 0,
      currency: 'EUR',
    },
  ],
}));

const categories = [...new Set(products.map((p) => p.category_external_code))].map(
  (code) => ({
    external_code: code,
    name: { ru: code, en: code },
  })
);

const data = {
  languages: ['ru', 'en'],
  currencies: [{ code: 'EUR', symbol: '€', rate: 1, is_default: true, is_active: true }],
  price_types: [
    {
      slug: 'retail',
      currency_code: 'EUR',
      is_default: true,
      name: { ru: 'Розничная', en: 'Retail' },
    },
  ],
  families: [
    {
      code: `fam_${PREFIX}_doors`,
      name: { ru: 'Двери ConfigDoor', en: 'ConfigDoor doors' },
    },
  ],
  types,
  categories,
  products,
  attributes: [],
  complex_dictionaries: [
    {
      external_code: `dict_door_legacy_config`,
      code: 'door_legacy_config',
      name: {
        ru: 'Конфигурация калькулятора ConfigDoor (как в легаси)',
        en: 'ConfigDoor calculator config',
      },
      meta_schema: null,
      is_active: true,
      records: configRows.map(({ key, row }, index) => ({
        external_code: `rec_door_legacy_config_${index}`,
        slug: key,
        name: { ru: key, en: key },
        meta: row,
        sort_order: index,
        is_active: true,
      })),
    },
    {
      external_code: 'dict_door_settings',
      code: 'door_settings',
      name: { ru: 'Настройки расчёта дверей', en: 'Door calculation settings' },
      meta_schema: null,
      is_active: true,
      records: [
        {
          slug: 'currency',
          meta: { code: 'EUR', price_column: 'priceEUR' },
          sort_order: 10,
          is_active: true,
        },
        { slug: 'dealer', meta: { dealer_margin: 0 }, sort_order: 20, is_active: true },
      ],
    },
  ],
  pipelines: [
    {
      code: 'pl_swing',
      name: { ru: 'Распашная дверь', en: 'Swing door' },
      slots: [
        'frame',
        'door',
        'hinge',
        'handle',
        'lock',
        'frameCover',
        'doorCover',
        'glass',
      ].map((role, i) => ({
        role,
        sort_order: (i + 1) * 10,
      })),
    },
  ],
  binding_rules: [],
};

const targets = [
  path.join(ROOT, 'import', 'import_data.json'),
  path.join(ROOT, 'src', 'app', 'mocks', 'fixtures', 'import-data.json'),
];

for (const target of targets) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data)}\n`);
}

console.log(
  `[door-importer] товаров: ${products.length}, строк конфигурации: ${configRows.length}`
);
console.log(
  `[door-importer] записано: ${targets.map((t) => path.relative(ROOT, t)).join(', ')}`
);
