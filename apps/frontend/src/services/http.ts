import axios, { AxiosPromise, AxiosRequestConfig, ResponseType } from 'axios';
import { useCallback, useContext, useMemo } from 'react';
import { authContext } from './authcontext';
import { isTokenExpired } from './authutils';

declare const __API_BASE_URL__: string;

axios.defaults.baseURL = __API_BASE_URL__;
export const TENANT = window.location.hostname;
export function getAuthHeaderForToken(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const useHttpManagerForGeneratedClient = <T>(): ((config: AxiosRequestConfig) => Promise<T>) => {
  const { withHeaders } = useHttpManager();
  return useCallback(
    (config: AxiosRequestConfig) => {
      const source = axios.CancelToken.source();
      const promise = withHeaders<T>(config, false).then(({ data }) => data);
      (promise as unknown as { cancel: () => void; }).cancel = () => {
        source.cancel('Query was cancelled by React Query');
      };
      return promise;
    },
    [withHeaders]
  );
};

type HttpHeaders = Record<string, string>;
export const useHttpManager = () => {
  const { authToken, logout } = useContext(authContext);

  const getHeaders = useCallback(
    (token?: string | null) => {
      const headers: Record<string, string> = {
        'content-type': 'application/json',
        'x-tenant-id': window.location.hostname,
      };

      if (!token) {
        return headers;
      }

      return {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    },
    []
  );

  const getHeadersWithAuth = useCallback(() => getHeaders(authToken), [authToken, getHeaders]);

  const withHeaders = useCallback(
    async <T = any>(config: AxiosRequestConfig<T>, requiresAuth = true, customHeaders: HttpHeaders = {}): AxiosPromise<T> => {
      if (requiresAuth && (!authToken || isTokenExpired(authToken))) {
        logout();
        return Promise.reject(new Error('Unauthorized'));
      }
      const headers = { ...getHeaders(authToken), ...customHeaders };
      const readyConfig = { ...config, headers };
      return axios(readyConfig);
    },
    [authToken, getHeaders, logout]
  );

  const get = useCallback(
    <T = any>(url: string, responseType: ResponseType = 'json', headers: HttpHeaders = {}) => {
      return withHeaders<T>({
        url,
        method: 'GET',
        responseType: responseType,
        headers: headers ?? {},
      });
    },
    [withHeaders]
  );

  const update = useCallback(
    <T = any>(
      url: string,
      data: any,
      verb: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      requiresAuth = true,
      headers: HttpHeaders = {},
      signal?: AbortSignal
    ) => {
      return withHeaders<T>(
        {
          url,
          method: verb,
          data,
          signal,
          headers: headers ?? {},
        },
        requiresAuth,
        headers
      );
    },
    [withHeaders]
  );

  const post = useCallback(
    <T = any>(url: string, data: any, requiresAuth = true, headers: HttpHeaders = {}, signal?: AbortSignal) => {
      return update<T>(url, data, 'POST', requiresAuth, headers ?? {}, signal);
    },
    [update]
  );

  const put = useCallback(
    <T = any>(url: string, data: any) => {
      return update<T>(url, data, 'PUT');
    },
    [update]
  );

  const patch = useCallback(
    <T = any>(url: string, data: any, requiresAuth = true, headers: HttpHeaders = {}) => {
      return update<T>(url, data, 'PATCH', requiresAuth, headers ?? {});
    },
    [update]
  );

  const deleteCall = useCallback(
    (url: string, headers: HttpHeaders = {}) => {
      return withHeaders({
        url,
        method: 'DELETE',
        headers: headers ?? {},
      });
    },
    [withHeaders]
  );

  const deleteWithPayload = useCallback(
    <T = any>(url: string, data: any) => {
      return update<T>(url, data, 'DELETE');
    },
    [update]
  );

  return useMemo(
    () => ({
      withHeaders,
      get,
      getHeadersWithAuth,
      post,
      put,
      patch,
      delete: deleteCall,
      deleteWithPayload,
    }),
    [get, getHeadersWithAuth, post, put, patch, deleteCall, deleteWithPayload, withHeaders]
  );
};
