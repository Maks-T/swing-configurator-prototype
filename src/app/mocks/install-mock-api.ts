import { setApiAdapter } from '@/shared/api';
import { DOOR_IMPORT_DATA_URL } from '@/entities/door-catalog';

import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';

/** Маршруты мок-API: ответ в формате ядра VMS-NC (import_data.json) */
const ROUTES: Record<string, () => Promise<unknown>> = {
  [`GET ${DOOR_IMPORT_DATA_URL}`]: async () =>
    (await import('./fixtures/import-data.json')).default,
};

const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  const key = `${(config.method ?? 'get').toUpperCase()} ${config.url ?? ''}`;
  const handler = ROUTES[key];

  if (!handler) {
    return Promise.reject(new Error(`Mock API: route ${key} is not defined`));
  }

  return {
    data: await handler(),
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
};

/** Включает мок-API, если VITE_USE_MOCK_API=true */
export function installMockApi(): void {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    setApiAdapter(mockAdapter);
  }
}
