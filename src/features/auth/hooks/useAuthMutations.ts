import { useMutation } from '@tanstack/react-query';

import { buildUserFromAuthResponse } from '../../../shared/api/jwt';
import { startSignalRConnection, stopSignalRConnection } from '../../../shared/api/signalr';
import { clearTokens, saveTokens } from '../../../shared/api/tokenStorage';
import { useAuthStore } from '../../../shared/store/authStore';
import type { GoogleLoginRequest, VerifyEmailRequest } from '../../../shared/types/user';
import {
  googleLoginRequest,
  logoutRequest,
  resendVerificationRequest,
  verifyEmailRequest,
} from '../api/authApi';

async function applyAuthSession(data: Parameters<typeof buildUserFromAuthResponse>[0]) {
  const user = buildUserFromAuthResponse(data);
  if (!user) {
    throw new Error('Unable to read user from auth response');
  }

  await saveTokens(data.accessToken, data.refreshToken);
  useAuthStore.getState().setSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user,
  });
  await startSignalRConnection();
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailRequest) => verifyEmailRequest(payload),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerificationRequest({ email }),
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (payload: GoogleLoginRequest) => googleLoginRequest(payload),
    onSuccess: async (data) => {
      await applyAuthSession(data);
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        try {
          await logoutRequest({ refreshToken });
        } catch {
          // Continue local logout if API fails.
        }
      }
      await stopSignalRConnection();
      await clearTokens();
      clearSession();
    },
  });
}
