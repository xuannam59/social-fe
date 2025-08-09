import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL as string;
console.log(baseURL);
const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
// Add a request interceptor
instance.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined' && window && window.localStorage && window.localStorage.getItem('access_token')) {
      config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
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
  res => res.data,
  async error => {
    // xử lý refresh_token hết hạn
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
