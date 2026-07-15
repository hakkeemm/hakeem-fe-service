export type UserRole = 'patient' | 'doctor' | 'assistant';

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

export interface LoginRequest {
  email: string;
  password: string;
  /** Mock-only: select which role JWT to issue during scaffold */
  role?: UserRole;
}

/** Matches backend RegisterRequestDto */
export interface RegisterRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
