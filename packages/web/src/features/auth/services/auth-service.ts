import { AuthRequest, AuthResponse, UserInfoResponse } from '../types/auth.types';
import { client } from '@/shared/lib/api/client';
import { API_ENDPOINTS } from '@/shared/lib/api/endpoints';
import { ApiResponse } from '@/shared/lib/api/types';

/**
 * 로그인 API
 * @param data - 로그인 요청 데이터
 * @returns - 로그인 응답 데이터
 */
export async function login(
  data: AuthRequest
): Promise<ApiResponse<AuthResponse>> {
  const response = await client.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  );
  return response.data;
}

/**
 * 회원가입 API
 * @param data - 회원가입 요청 데이터
 * @returns - 회원가입 응답 데이터
 */
export async function signUp(
  data: AuthRequest
): Promise<ApiResponse<AuthResponse>> {
  const response = await client.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.SIGNUP,
    data
  );

  return response.data;
}

/**
 * 유저 정보 조회 API
 * @returns - 유저 정보 응답 데이터
 */
export async function getMe(): Promise<UserInfoResponse | null> {
  const response = await client.get<ApiResponse<UserInfoResponse | null>>(
    API_ENDPOINTS.AUTH.ME
  );

  if (!response.data.success) return null;

  return response.data.payload ?? null;
}

/**
 * 로그아웃 API
 */
export async function logout(): Promise<ApiResponse<null>> {
  const response = await client.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGOUT
  );
  return response.data;
}
