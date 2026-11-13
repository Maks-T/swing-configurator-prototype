/*
|--------------------------------------------------------------------------
| CSV-парсер легаси-конфигураций ConfigDoor
|--------------------------------------------------------------------------
|
| Разделитель ';', кавычки по RFC 4180, BOM, CRLF, строки-разделители '###'.
| Перенесён из dorian-importer без изменений логики.
|
*/

import fs from 'node:fs';

/**
 * Очищает BOM и нормализует переносы строк
 * @param {string} text
 * @returns {string}
 */
export function cleanText(text) {
  const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  return withoutBom.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Токенизатор CSV в двумерный массив строк
 * @param {string} content
 * @param {string} delimiter
 * @returns {string[][]}
 */
export function tokenizeCsv(content, delimiter = ';') {
  const normalized = cleanText(content);
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if (inQuotes) {
      if (char === '"' && normalized[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field.trim());
      field = '';
    } else if (char === '\n') {
      row.push(field.trim());
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field.trim());
    rows.push(row);
  }

  return rows;
}

/**
 * Пустая строка или строка-комментарий ('###', '//')
 * @param {string[]} row
 * @returns {boolean}
 */
export function isCommentOrEmptyRow(row) {
  const cells = (row ?? []).filter((cell) => cell.length > 0);
  if (cells.length === 0) {
    return true;
  }
  return cells[0].startsWith('#') || cells[0].startsWith('//');
}

/**
 * Читает CSV в массив объектов по заголовку первой строки.
 * Без молчаливых fallback: отсутствующий файл — ошибка.
 * @param {string} filePath
 * @returns {Array<Record<string, string>>}
 */
export function parseCsvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV-файл не найден: ${filePath}`);
  }

  const rows = tokenizeCsv(fs.readFileSync(filePath, 'utf8'));
  const header = (rows[0] ?? []).map((h) => h.replace(/\*$/, '').trim());
  const records = [];

  for (const row of rows.slice(1)) {
    if (isCommentOrEmptyRow(row)) {
      continue;
    }
    const record = {};
    header.forEach((name, index) => {
      if (name) {
        record[name] = row[index] ?? '';
      }
    });
    records.push(record);
  }

  return records;
}

/**
 * Строгий парсинг числа: запятая как десятичный разделитель, пусто → null.
 * Мусор в ячейке — ошибка с указанием источника.
 * @param {string|undefined} value
 * @param {string} source
 * @returns {number|null}
 */
export function toNumber(value, source = '') {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }
  const normalized = String(value).trim().replace(/\s+/g, '').replace(',', '.');
  const n = Number(normalized);
  if (Number.isNaN(n)) {
    throw new Error(`Не число "${value}" ${source}`);
  }
  return n;
}
