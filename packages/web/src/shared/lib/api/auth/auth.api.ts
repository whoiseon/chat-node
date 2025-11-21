import { AuthRequest, AuthResponse, UserInfoResponse } from './auth.types';
import { client } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../types';

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
  console.log(response.data);
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
export async function getMe(
  accessToken?: string
): Promise<ApiResponse<UserInfoResponse>> {
  const response = await client.get<ApiResponse<UserInfoResponse>>(
    API_ENDPOINTS.AUTH.ME,
    {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    }
  );

  return response.data;
}

/**
 * 토큰 갱신 API
 * @returns - 갱신된 토큰 정보
 */
export async function refreshToken(): Promise<ApiResponse<null>> {
  const response = await client.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.REFRESH
  );
  return response.data;
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
