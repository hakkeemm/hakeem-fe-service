import { useMutation } from '@tanstack/react-query';

import type { RegisterRequest } from '../../../shared/types/user';
import { registerRequest } from '../api/authApi';

/** Register does not return tokens — email verification is required first. */
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => registerRequest(payload),
  });
}
