import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class AxiosRequester {
  private readonly logger = new Logger(AxiosRequester.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Makes an HTTP GET request to the specified URL.
   *
   * @param {string} url - The URL to send the GET request to.
   * @param {Record<string, any>} [queryParams] - Optional query parameters.
   * @returns {Promise<AxiosResponse<T>>} A promise that resolves to the Axios response object.
   *
   * @description
   * Sends an HTTP GET request using the specified URL and optional query parameters.
   * Logs the request details and handles any errors encountered during the request.
   */
  public async get<T>(
    url: string,
    queryParams?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`[AXIOS-REQUEST-GET] ${url}`);
      const response = await this.httpService
        .get<T>(url, {
          params: queryParams,
        })
        .toPromise();
      return response;
    } catch (error) {
      this.logger.error(`[AXIOS-REQUEST-GET] ${error.message}`);
      throw error;
    }
  }

  /**
   * Makes an HTTP POST request to the specified URL.
   *
   * @param {string} url - The URL to send the POST request to.
   * @param {Record<string, any>} [data] - Optional data to be sent in the body of the request.
   * @param {Record<string, any>} [queryParams] - Optional query parameters.
   * @returns {Promise<AxiosResponse<T>>} A promise that resolves to the Axios response object.
   *
   * @description
   * Sends an HTTP POST request using the specified URL, body data, and query parameters.
   * Logs the request details and handles any errors encountered during the request.
   */
  public async post<T>(
    url: string,
    data?: Record<string, any>,
    queryParams?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`[AXIOS-REQUEST-POST] ${url}`);
      return await this.httpService
        .post<T>(url, data, { params: queryParams })
        .toPromise();
    } catch (error) {
      this.logger.error(`[AXIOS-REQUEST-POST] ${error.message}`);
      throw error;
    }
  }

  /**
   * Makes an HTTP PUT request to the specified URL.
   *
   * @param {string} url - The URL to send the PUT request to.
   * @param {Record<string, any>} [data] - Optional data to be sent in the body of the request.
   * @param {Record<string, any>} [queryParams] - Optional query parameters.
   * @returns {Promise<AxiosResponse<T>>} A promise that resolves to the Axios response object.
   *
   * @description
   * Sends an HTTP PUT request using the specified URL, body data, and query parameters.
   * Logs the request details and handles any errors encountered during the request.
   */
  public async put<T>(
    url: string,
    data?: Record<string, any>,
    queryParams?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`[AXIOS-REQUEST-PUT] ${url}`);
      return await this.httpService
        .put<T>(url, data, { params: queryParams })
        .toPromise();
    } catch (error) {
      this.logger.error(`[AXIOS-REQUEST-PUT] ${error.message}`);
      throw error;
    }
  }

  /**
   * Makes an HTTP DELETE request to the specified URL.
   *
   * @param {string} url - The URL to send the DELETE request to.
   * @param {Record<string, any>} [queryParams] - Optional query parameters.
   * @returns {Promise<AxiosResponse<T>>} A promise that resolves to the Axios response object.
   *
   * @description
   * Sends an HTTP DELETE request using the specified URL and optional query parameters.
   * Logs the request details and handles any errors encountered during the request.
   */
  public async delete<T>(
    url: string,
    queryParams?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`[AXIOS-REQUEST-DELETE] ${url}`);
      return await this.httpService
        .delete<T>(url, { params: queryParams })
        .toPromise();
    } catch (error) {
      this.logger.error(`[AXIOS-REQUEST-DELETE] ${error.message}`);
      throw error;
    }
  }

  /**
   * Makes an HTTP PATCH request to the specified URL.
   *
   * @param {string} url - The URL to send the PATCH request to.
   * @param {Record<string, any>} [data] - Optional data to be sent in the body of the request.
   * @param {Record<string, any>} [queryParams] - Optional query parameters.
   * @returns {Promise<AxiosResponse<T>>} A promise that resolves to the Axios response object.
   *
   * @description
   * Sends an HTTP PATCH request using the specified URL, body data, and query parameters.
   * Logs the request details and handles any errors encountered during the request.
   */
  public async patch<T>(
    url: string,
    data?: Record<string, any>,
    queryParams?: Record<string, any>,
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`[AXIOS-REQUEST-PATCH] ${url}`);
      return await this.httpService
        .patch<T>(url, data, { params: queryParams })
        .toPromise();
    } catch (error) {
      this.logger.error(`[AXIOS-REQUEST-PATCH] ${error.message}`);
      throw error;
    }
  }
}
