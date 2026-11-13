import Axios, { type AxiosAdapter, type AxiosRequestConfig } from 'axios';

import { applyInterceptors } from './interceptors';

const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.API_BASE_URL,
  withCredentials: true,
});

applyInterceptors(AXIOS_INSTANCE);

export const setApiBaseUrl = (baseURL: string) => {
  AXIOS_INSTANCE.defaults.baseURL = baseURL;
};

export const getApiBaseUrl = () => AXIOS_INSTANCE.defaults.baseURL ?? '';

/** Подмена транспорта (мок-API прототипа). Контракты Zod продолжают работать. */
export const setApiAdapter = (adapter: AxiosAdapter) => {
  AXIOS_INSTANCE.defaults.adapter = adapter;
};

export const instance = <T>(config: AxiosRequestConfig): Promise<T> =>
  AXIOS_INSTANCE.request<T>(config).then(({ data }) => data);
