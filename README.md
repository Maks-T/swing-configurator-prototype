# swing-configurator

Независимый фронтенд-прототип расчёта распашных дверей (перенос calc ConfigDoor, type = swing) под будущее ядро VMS-NC. Работает на моковом API, без бэкенда.

## Запуск

```powershell
pnpm install
Copy-Item .env.example .env   # VITE_USE_MOCK_API=true
pnpm dev                      # http://localhost:5173
pnpm test                     # ядро + UI-утилиты
pnpm lint; pnpm typecheck
```

Данные: `pnpm import:data <папка configdoor/public>` → `import/import_data.json` (формат ядра) и фикстура мок-API `src/app/mocks/fixtures/import-data.json`.

## Устройство

| Слой | Что внутри |
| --- | --- |
| `calculation/door-kit` | **Общая часть семейства дверей** (кандидат в пакет `@vms/door-kit`): доступ к таблицам легаси (`LegacyData`: getByParam/getFilter как `store/List.ts`), смета с округлениями `Estimate.js`, размеры проём → короб → полотно, короба, петли, полотна, вставки, ручки/замки, списки опций, геометрия фасада |
| `calculation/swing` | Тонкий сценарий распашной двери `calculateSwing(setup, data)` поверх door-kit + golden-тесты |
| `tools/door-importer` | CSV легаси (`config/c_*.csv`, `price/p_*.csv`) → `import_data.json`: товары с `eav.legacy`, словарь `door_legacy_config`, настройки |
| `src/entities` | `door-catalog` (загрузка данных, образцы стекла/покрытий), `swing-project` (setup, история, черновик, нормализация выбора) |
| `src/features` | конструкция (проём, открывание, короб, полотно), фурнитура, покрытие, отделка, файл проекта |
| `src/widgets` | фасад (SVG, снаружи/изнутри), чертежи (cad-blueprint: фасады + спецификация, SVG/DXF/VCAD), смета (колонки легаси, С/С), шапка |
| `src/pages/swing` | dockview-раскладка |

### Что выносить в пакеты

- `calculation/door-kit` целиком: не зависит от React и swing. Для створчатых (bivalve), откатных и маятниковых дверей добавляются только сценарии `calculation/<kind>` и размеры в `sizes.ts`.
- `tools/door-importer` — общий импортёр всех дверных расчётов.
- `src/entities/door-catalog`, `src/widgets/estimate-panel`, `src/widgets/door-drawings` переиспользуются без изменений; `features/door-covers`, `door-hardware`, `leaf-finish` зависят только от `DoorSetup`.

## Сверка с легаси

Скриншот спецификации (900×2060, Standart 51 + TECHNOFORM, петли 3D хром, Black sand) воспроизводится построчно: короб 872×2046, полотно 800×2000, 2 петли, короб 393 €, полотно 275 €, итого 668 €, себестоимость 90.035 / 71.525. Smoke-тесты: все поддержанные пары короб × полотно считаются без позиций «нет в прайсе».

## Пока не сделано

- МДФ-полотна (Fondo, DF и т. п.), короба кроме Standart 51 / Modula 51 / Monoblock.
- Наличники и доборы, тип помещения, декор-шаблоны и эмали, двустворчатые двери.
- Дополнительные позиции, услуги, выгрузка в ERP.
- Golden-тесты на реальных заказах: нужна выгрузка заказов `$type = 'swing'`.
