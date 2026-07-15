import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/user';

export function useRole(): UserRole | null {
  return useAuthStore((state) => state.role);
}
