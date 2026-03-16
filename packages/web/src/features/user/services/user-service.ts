import { API_ENDPOINTS } from '@/shared/lib/api/endpoints';
import { ApiResponse } from '@/shared/lib/api/types';
import { client } from '@/shared/lib/api/client';

import { UserNpResponse, UserResponse } from '../types/user.types';

/**
 * 유저 정보 조회 API
 * @returns - 유저 정보 응답 데이터
 */
export async function getMe(): Promise<UserResponse | null> {
  const response = await client.get<ApiResponse<UserResponse | null>>(
    API_ENDPOINTS.USER.ME
  );

  if (!response.data.success) return null;

  return response.data.payload ?? null;
}

/**
 * 유저 NP 조회 API
 */
export async function getMyNp(): Promise<UserNpResponse | null> {
  const response = await client.get<ApiResponse<UserNpResponse>>(
    API_ENDPOINTS.NP.MY_NP
  );

  return response.data.payload ?? null;
}