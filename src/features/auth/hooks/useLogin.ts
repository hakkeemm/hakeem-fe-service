import { useMutation } from '@tanstack/react-query';

import { buildUserFromAuthResponse } from '../../../shared/api/jwt';
import { startSignalRConnection } from '../../../shared/api/signalr';
import { saveTokens } from '../../../shared/api/tokenStorage';
import { useAuthStore } from '../../../shared/store/authStore';
import type { LoginRequest } from '../../../shared/types/user';
import { loginRequest } from '../api/authApi';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginRequest) => loginRequest(payload),
    onSuccess: async (data) => {
      const user = buildUserFromAuthResponse(data);
      if (!user) {
        throw new Error('Unable to read user from auth response');
      }

      await saveTokens(data.accessToken, data.refreshToken);
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user,
      });
      await startSignalRConnection();
    },
  });
}
