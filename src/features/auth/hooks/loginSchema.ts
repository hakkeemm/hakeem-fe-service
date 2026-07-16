import { z } from 'zod';

import { emailField } from './authValidation';

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'auth.passwordRequired'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
