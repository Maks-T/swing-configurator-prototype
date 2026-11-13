import { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { AxiosValidationError } from './axios-validation-error';

import type { ZodType } from 'zod/v4';

declare module 'axios' {
  export interface AxiosRequestConfig {
    contracts?: {
      response?: ZodType<unknown>;
      body?: ZodType<unknown>;
      params?: ZodType<unknown>;
    };
  }
}

/**
 * A class containing static methods for validating and transforming data using Zod schemas.
 */
export class AxiosContracts {
  /**
   * Validates and normalizes request body and query params according to configured contracts.
   *
   * @param config Axios request config to validate before sending.
   * @returns Updated request config with parsed payload.
   * @throws {AxiosValidationError} When request data does not satisfy contract schema.
   */
  static requestContractInterceptor(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const { contracts } = config;

    if (contracts === undefined) {
      return config;
    }

    return {
      ...config,
      ...(contracts.body !== undefined && config.data !== undefined
        ? { data: AxiosContracts.parseRequest(contracts.body, config.data) }
        : {}),
      ...(contracts.params !== undefined && config.params !== undefined
        ? {
            params: AxiosContracts.parseRequest(contracts.params, config.params),
          }
        : {}),
    };
  }

  /**
   * Parses request data with the provided Zod schema.
   *
   * @template Data Expected request data type.
   * @param schema Zod schema used to validate request data.
   * @param data Request data to validate.
   * @returns Parsed and type-safe request data.
   * @throws {AxiosValidationError} When validation fails.
   */
  static parseRequest<Data>(schema: ZodType<Data>, data: unknown): Data {
    const validation = schema.safeParse(data);

    if (validation.error) {
      throw new AxiosValidationError(
        { headers: new AxiosHeaders() },
        undefined,
        undefined,
        validation.error.issues
      );
    }

    return validation.data;
  }

  /**
   * Validates response payload using response contract from request config.
   *
   * @param response Axios response to validate.
   * @returns Original response with validated and parsed data.
   * @throws {AxiosValidationError} When response data does not satisfy contract schema.
   */
  static responseContractInterceptor(response: AxiosResponse): AxiosResponse {
    const schema = response.config.contracts?.response;

    if (schema === undefined) {
      return response;
    }

    return {
      ...response,
      data: AxiosContracts.parseResponse(schema, response),
    };
  }

  /**
   * Parses response data with the provided Zod schema.
   *
   * @template Data Expected response data type.
   * @param schema Zod schema used to validate response data.
   * @param response Axios response containing raw data.
   * @returns Parsed and type-safe response data.
   * @throws {AxiosValidationError} When validation fails.
   */
  static parseResponse<Data>(
    schema: ZodType<Data>,
    response?: AxiosResponse<unknown>
  ): Data {
    const validation = schema.safeParse(response?.data);

    if (validation.error) {
      throw new AxiosValidationError(
        response?.config,
        response?.request,
        response,
        validation.error.issues
      );
    }
    return validation.data;
  }
}
