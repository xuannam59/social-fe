import type { IBackendRes } from '@social/types/backend.type';
import { Mutex } from 'async-mutex';
import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL as string;
const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

const handleRefreshToken = async () => {
  return await mutex.runExclusive(async () => {
    const res = await instance.post<IBackendRes<string>>(
      '/api/v1/auths/refresh-token'
    );
    if (res && res.data) return res.data;
    else return null;
  });
};

instance.interceptors.request.use(
  function (config) {
    const excludedEndpoints = [
      '/api/v1/auths/login',
      '/api/v1/auths/register',
      '/api/v1/auths/forgot-password',
      '/api/v1/auths/verify-otp',
      '/api/v1/auths/reset-password',
    ];
    const shouldExcludeToken = excludedEndpoints.some(endpoint =>
      config.url?.endsWith(endpoint)
    );

    if (
      !shouldExcludeToken &&
      typeof window !== 'undefined' &&
      window &&
      window.localStorage &&
      window.localStorage.getItem('access_token')
    ) {
      config.headers.Authorization =
        'Bearer ' + window.localStorage.getItem('access_token');
    }
    if (!config.headers.Accept && config.headers['Content-Type']) {
      config.headers.Accept = 'application/json';
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (res) {
    return res.data;
  },
  async function (error) {
    const excludedEndpoints = [
      '/api/v1/auths/login',
      '/api/v1/auths/register',
      '/api/v1/auths/forgot-password',
      '/api/v1/auths/verify-otp',
      '/api/v1/auths/reset-password',
    ];
    const shouldExcludeToken = excludedEndpoints.some(endpoint =>
      error.config?.url?.endsWith(endpoint)
    );

    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER] &&
      !shouldExcludeToken
    ) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = 'true';
      if (access_token) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`;
        localStorage.setItem('access_token', access_token);
        return instance.request(error.config);
      }
    }

    console.log(error.config.url, error.response.status);

    if (
      error.config &&
      error.response &&
      error.response.status === 400 &&
      error.config.url === '/api/v1/auths/refresh-token'
    ) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
