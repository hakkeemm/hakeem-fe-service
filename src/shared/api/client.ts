import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { AUTH_ENDPOINTS } from '../../features/auth/api/authEndpoints';
import type { AuthResponse } from '../types/user';
import { useAuthStore } from '../store/authStore';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000';

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

    // Don't try to refresh the refresh call itself
    if (originalRequest.url?.includes(AUTH_ENDPOINTS.refreshToken)) {
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

      const { data } = await axios.post<AuthResponse>(
        `${API_URL}${AUTH_ENDPOINTS.refreshToken}`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      await saveTokens(data.accessToken, data.refreshToken);
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

      resolveRefreshWaiters(data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
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
