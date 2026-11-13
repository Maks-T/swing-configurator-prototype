import type * as SDoorCatalog from './schemas';
import type { z } from 'zod/v4';

export type ImportData = z.infer<typeof SDoorCatalog.ImportData>;
