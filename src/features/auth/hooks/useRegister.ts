import { useMutation } from '@tanstack/react-query';

import { startSignalRConnection } from '../../../shared/api/signalr';
import { saveTokens } from '../../../shared/api/tokenStorage';
import { useAuthStore } from '../../../shared/store/authStore';
import type { RegisterRequest } from '../../../shared/types/user';
import { registerRequest } from '../api/authApi';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: RegisterRequest) => registerRequest(payload),
    onSuccess: async (data) => {
      await saveTokens(data.accessToken, data.refreshToken);
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      await startSignalRConnection();
    },
  });
}
