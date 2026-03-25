import {
  CheckUsernameResponseDto,
  MeResponseDto,
  NullPayloadResponseDto,
  RefreshResponseDto,
  SignInDto,
  SignUpDto,
} from '@repo/api-types';

import { api } from '../client';
import { serverApi } from '../server-client';

const ME_FALLBACK: MeResponseDto = {
  error: null,
  payload: { user: null },
};

export const authApi = {
  getMe: async (cookie?: string): Promise<MeResponseDto> => {
    try {
      if (cookie) {
        return await serverApi.get<MeResponseDto>('/auth/me', cookie);
      }
      return await api.get<MeResponseDto>('/auth/me');
    } catch {
      return ME_FALLBACK;
    }
  },

  checkUsername: (username: string) => {
    return api.get<CheckUsernameResponseDto>(
      `/auth/check-username?username=${encodeURIComponent(username)}`,
    );
  },

  signIn: (data: SignInDto) => {
    return api.post<NullPayloadResponseDto>('/auth/sign-in', data);
  },

  signUp: (data: SignUpDto) => {
    return api.post<NullPayloadResponseDto>('/auth/sign-up', data);
  },

  signOut: () => {
    return api.delete<NullPayloadResponseDto>('/auth/sign-out');
  },

  refresh: () => {
    return api.post<RefreshResponseDto>('/auth/refresh');
  },
};

export const authKeys = {
  me: ['auth', 'me'] as const,
};
