import { z } from 'zod/v4';

export const envSchema = z.object({
  API_BASE_URL: z
    .string({ error: 'API_BASE_URL обязателен' })
    .url('API_BASE_URL должен быть валидным URL'),
  ASSETS_URL: z
    .string({ error: 'ASSETS_URL обязателен' })
    .url('ASSETS_URL должен быть валидным URL'),
  ROOT_CONTAINER: z
    .string({ error: 'ROOT_CONTAINER обязателен' })
    .min(1, 'ROOT_CONTAINER не может быть пустым'),
  VITE_USE_MOCK_API: z.enum(['true', 'false']).optional(),
  VITE_STANDALONE: z.enum(['true', 'false']).optional(),
});

export type Env = z.infer<typeof envSchema>;
