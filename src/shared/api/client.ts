import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '../store/authStore';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshWaiters: ((token: string | null) => void)[] = [];

function resolveRefreshWaiters(token: string | null): void {
  refreshWaiters.forEach((resolve) => resolve(token));
  refreshWaiters = [];
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken ?? (await getAccessToken());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      const token = await new Promise<string | null>((resolve) => {
        refreshWaiters.push(resolve);
      });

      if (!token) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const useMock = process.env.EXPO_PUBLIC_USE_MOCK_AUTH !== 'false';

      let accessToken: string;
      let nextRefreshToken: string;

      if (useMock) {
        accessToken = useAuthStore.getState().accessToken ?? '';
        nextRefreshToken = refreshToken;
        if (!accessToken) {
          throw new Error('No access token to refresh in mock mode');
        }
      } else {
        const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_URL}/auth/refresh`,
          { refreshToken },
        );
        accessToken = data.accessToken;
        nextRefreshToken = data.refreshToken;
      }

      await saveTokens(accessToken, nextRefreshToken);
      useAuthStore.getState().setTokens(accessToken, nextRefreshToken);

      resolveRefreshWaiters(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      resolveRefreshWaiters(null);
      await clearTokens();
      useAuthStore.getState().clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
