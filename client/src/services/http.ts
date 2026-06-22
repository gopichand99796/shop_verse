import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api/v1';

console.log('API baseURL:', baseURL);
const api = axios.create({ baseURL, timeout: 10000 });

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setAccessToken(token?: string | null) {
  if (token) localStorage.setItem('accessToken', token);
  else localStorage.removeItem('accessToken');
}

export function setRefreshToken(token?: string | null) {
  if (token) localStorage.setItem('refreshToken', token);
  else localStorage.removeItem('refreshToken');
}

export function clearAuthTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}

export function setAuthHeader(token?: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

let refreshPromise: Promise<string | null> | null = null;
let refreshFailed = false;
const skipRefreshPaths = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];

async function attemptTokenRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      { timeout: 10000 }
    );
    const data = response.data as any;
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      if (data.refreshToken) setRefreshToken(data.refreshToken);
      setAuthHeader(data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch (err) {
    return null;
  }
}

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url || '';
    const isRefreshRequest = skipRefreshPaths.some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      if (!refreshPromise) {
        refreshPromise = attemptTokenRefresh();
      }
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        return api(originalRequest);
      }

      if (!refreshFailed) {
        refreshFailed = true;
        toast.error('Session expired. Please sign in again.');
        clearAuthTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
