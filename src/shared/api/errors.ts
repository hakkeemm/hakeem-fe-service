import axios from 'axios';

import type { ApiErrorBody } from '../types/user';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | string | undefined;
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    if (data && typeof data === 'object') {
      return (
        data.error ??
        data.Error ??
        data.message ??
        data.Message ??
        fallback
      );
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getApiErrorCode(error: unknown): string | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }
  const data = error.response?.data as ApiErrorBody | undefined;
  return data?.code ?? data?.Code ?? null;
}
