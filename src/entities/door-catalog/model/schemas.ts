import { z } from 'zod/v4';

/**
 * Контракт import_data.json ядра VMS-NC для дверей. Проверяем форму верхнего
 * уровня: строки прайса и конфигурации переносятся «как в легаси» и
 * проверяются расчётом (позиция без цены видна в смете как заглушка).
 */
export const ImportData = z.object({
  products: z.array(
    z.looseObject({
      code: z.string(),
      eav: z.looseObject({ legacy: z.looseObject({ id: z.string(), name: z.string() }) }),
    })
  ),
  complex_dictionaries: z.array(
    z.looseObject({
      code: z.string(),
      records: z.array(
        z.looseObject({ slug: z.string(), meta: z.record(z.string(), z.unknown()) })
      ),
    })
  ),
});
