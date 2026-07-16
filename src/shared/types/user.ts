export type UserRole = 'patient' | 'doctor' | 'assistant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Matches backend LoginRequestDto */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Matches backend RegisterRequestDto */
export interface RegisterRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
}

/** Matches backend AuthResponseDto */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiErrorBody {
  error?: string;
  code?: string;
  Error?: string;
  Code?: string;
  message?: string;
  Message?: string;
}

/** @deprecated Use AuthResponse — kept for gradual migration */
export type LoginResponse = AuthResponse & { user?: User };
