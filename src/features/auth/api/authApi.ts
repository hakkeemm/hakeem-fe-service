import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserRole,
} from '../../../shared/types/user';
import { createMockJwt } from '../../../shared/api/jwt';
import { apiClient } from '../../../shared/api/client';

function mockUserName(role: UserRole): string {
  switch (role) {
    case 'doctor':
      return 'Dr. Sara Hassan';
    case 'assistant':
      return 'Mona Assistant';
    default:
      return 'Ahmed Patient';
  }
}

export async function loginRequest(body: LoginRequest): Promise<LoginResponse> {
  const useMock = process.env.EXPO_PUBLIC_USE_MOCK_AUTH !== 'false';

  if (useMock) {
    const role: UserRole = body.role ?? 'patient';
    const user = {
      id: `${role}-001`,
      email: body.email,
      name: mockUserName(role),
      role,
    };

    const accessToken = createMockJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      accessToken,
      refreshToken: `refresh-${role}-${Date.now()}`,
      user,
    };
  }

  const { data } = await apiClient.post<LoginResponse>('/auth/login', {
    email: body.email,
    password: body.password,
  });
  return data;
}

export async function registerRequest(body: RegisterRequest): Promise<LoginResponse> {
  const useMock = process.env.EXPO_PUBLIC_USE_MOCK_AUTH !== 'false';

  if (useMock) {
    const user = {
      id: `patient-${Date.now()}`,
      email: body.email,
      name: body.fullName,
      role: 'patient' as const,
    };

    const accessToken = createMockJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      accessToken,
      refreshToken: `refresh-patient-${Date.now()}`,
      user,
    };
  }

  const { data } = await apiClient.post<LoginResponse>('/auth/register', {
    email: body.email,
    fullName: body.fullName,
    phoneNumber: body.phoneNumber,
    password: body.password,
  });
  return data;
}
