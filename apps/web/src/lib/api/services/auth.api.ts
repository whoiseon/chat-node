import { api } from '../client';
import { serverApi } from '../server-client';

import type { ApiResponse } from '../types';

export interface MeUser {
  id: string;
  username: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
}

export interface MeResponse {
  user: MeUser | null;
}

export interface CheckUsernameResponse {
  exists: boolean;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  displayName: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

const ME_FALLBACK: ApiResponse<MeResponse> = {
  error: null,
  payload: { user: null },
};

export const authApi = {
  getMe: async (cookie?: string): Promise<ApiResponse<MeResponse>> => {
    try {
      if (cookie) {
        return await serverApi.get<ApiResponse<MeResponse>>('/auth/me', cookie);
      }
      return await api.get<ApiResponse<MeResponse>>('/auth/me');
    } catch {
      return ME_FALLBACK;
    }
  },

  checkUsername: (username: string) => {
    return api.post<ApiResponse<CheckUsernameResponse>>(
      '/auth/check-username',
      {
        username,
      },
    );
  },

  signIn: (data: SignInRequest) => {
    return api.post<ApiResponse<null>>('/auth/sign-in', data);
  },

  signUp: (data: SignUpRequest) => {
    return api.post<ApiResponse<null>>('/auth/sign-up', data);
  },

  signOut: () => {
    return api.post<ApiResponse<null>>('/auth/sign-out');
  },

  refresh: () => {
    return api.post<ApiResponse<AuthTokens>>('/auth/refresh');
  },
};

export const authKeys = {
  me: ['auth', 'me'] as const,
};
