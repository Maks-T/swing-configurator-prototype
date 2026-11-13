import type * as SApi from './schemas';
import type { z } from 'zod/v4';

export type GlobalSuccess = z.infer<typeof SApi.GlobalSuccess>;
export type GlobalError = z.infer<typeof SApi.GlobalError>;
