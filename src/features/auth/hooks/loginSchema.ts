import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  password: z.string().min(1, 'auth.passwordRequired').min(6, 'auth.passwordMin'),
  role: z.enum(['patient', 'doctor', 'assistant']),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
