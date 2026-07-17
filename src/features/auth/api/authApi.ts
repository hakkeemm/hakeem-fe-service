import { apiClient } from '../../../shared/api/client';
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '../../../shared/types/user';
import { AUTH_ENDPOINTS } from './authEndpoints';

export async function loginRequest(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.login, {
    email: body.email,
    password: body.password,
  });
  return data;
}

export async function registerRequest(body: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.register, {
    email: body.email,
    fullName: body.fullName,
    phoneNumber: body.phoneNumber,
    password: body.password,
  });
  return data;
}

export async function verifyEmailRequest(body: VerifyEmailRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.verifyEmail, {
    email: body.email,
    code: body.code,
  });
  return data;
}

export async function resendVerificationRequest(
  body: ResendVerificationRequest,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.resendVerification, {
    email: body.email,
  });
  return data;
}

export async function googleLoginRequest(body: GoogleLoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.google, {
    idToken: body.idToken,
  });
  return data;
}

export async function refreshTokenRequest(body: RefreshTokenRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.refreshToken, {
    refreshToken: body.refreshToken,
  });
  return data;
}

export async function logoutRequest(body: RefreshTokenRequest): Promise<void> {
  await apiClient.post(AUTH_ENDPOINTS.logout, {
    refreshToken: body.refreshToken,
  });
}

/** Backend expects email as a query string: POST /api/auth/forgot-password?email= */
export async function forgotPasswordRequest(
  body: ForgotPasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(AUTH_ENDPOINTS.forgotPassword, null, {
    params: { email: body.email },
  });
  return data;
}

export async function resetPasswordRequest(
  body: ResetPasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(AUTH_ENDPOINTS.resetPassword, {
    email: body.email,
    code: body.code,
    newPassword: body.newPassword,
  });
  return data;
}

export async function changePasswordRequest(
  body: ChangePasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(AUTH_ENDPOINTS.changePassword, {
    currentPassword: body.currentPassword,
    newPassword: body.newPassword,
  });
  return data;
}
