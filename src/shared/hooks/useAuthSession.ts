import { useCallback, useEffect, useState } from 'react';

import { decodeJwtPayload } from '../api/jwt';
import { startSignalRConnection, stopSignalRConnection } from '../api/signalr';
import { clearTokens, getAccessToken, getRefreshToken } from '../api/tokenStorage';
import { useAuthStore } from '../store/authStore';

export function useAuthSession() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  const [isRestoring, setIsRestoring] = useState(() => !isHydrated);

  useEffect(() => {
    if (isHydrated) {
      return;
    }

    let cancelled = false;

    async function restoreSession(): Promise<void> {
      try {
        const [token, refreshToken] = await Promise.all([getAccessToken(), getRefreshToken()]);
        if (cancelled) {
          return;
        }

        if (!token || !refreshToken) {
          clearSession();
          return;
        }

        const payload = decodeJwtPayload(token);
        if (!payload) {
          await clearTokens();
          clearSession();
          return;
        }

        setSession({
          accessToken: token,
          refreshToken,
          user: {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
          },
        });

        await startSignalRConnection();
      } catch {
        clearSession();
      } finally {
        if (!cancelled) {
          setHydrated(true);
          setIsRestoring(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [clearSession, isHydrated, setHydrated, setSession]);

  const logout = useCallback(async () => {
    await stopSignalRConnection();
    await clearTokens();
    clearSession();
  }, [clearSession]);

  return {
    isAuthenticated: Boolean(accessToken && role),
    isRestoring: isRestoring && !isHydrated,
    isHydrated,
    user,
    role,
    logout,
  };
}
