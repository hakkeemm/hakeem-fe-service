import { create } from 'zustand';

import type { User, UserRole } from '../types/user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  role: UserRole | null;
  isHydrated: boolean;
  setSession: (params: { accessToken: string; refreshToken: string; user: User }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  role: null,
  isHydrated: false,
  setSession: ({ accessToken, refreshToken, user }) =>
    set({
      accessToken,
      refreshToken,
      user,
      role: user.role,
    }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clearSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      role: null,
    }),
  setHydrated: (value) => set({ isHydrated: value }),
}));
