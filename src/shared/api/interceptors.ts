import { AxiosContracts } from './validation';

import type { AxiosInstance } from 'axios';

export function applyInterceptors(instance: AxiosInstance) {
  //установка хедеров
  instance.interceptors.request.use(
    (config) =>
      //if (AccessToken.header) {
      //config.headers.set('Authorization', AccessToken.header);
      //}
      config
  );
  //валидация запросов
  instance.interceptors.request.use((config) =>
    AxiosContracts.requestContractInterceptor(config)
  );

  //валидация ответов
  instance.interceptors.response.use((response) =>
    AxiosContracts.responseContractInterceptor(response)
  );
}
