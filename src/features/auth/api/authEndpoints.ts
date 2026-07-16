/** Auth API paths — matches Hakeem.API AuthController (`api/[controller]`). */
export const AUTH_ENDPOINTS = {
  register: '/api/auth/register',
  verifyEmail: '/api/auth/verify-email',
  resendVerification: '/api/auth/resend-verification',
  login: '/api/auth/login',
  google: '/api/auth/google',
  googleLogin: '/api/auth/google/login',
  googleCallback: '/api/auth/google/callback',
  refreshToken: '/api/auth/refresh-token',
  logout: '/api/auth/logout',
} as const;

export type AuthEndpointKey = keyof typeof AUTH_ENDPOINTS;
