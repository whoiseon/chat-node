import { ApiResponse } from '@/shared/lib/api/types';
import { ServerCreateSchema } from '../schemas/create-server.schema';
import {
  ServerCreateResponse,
  ServerListParams,
  ServerListResponse,
  ServerTagListResponse,
} from '../types/server.types';
import { client } from '@/shared/lib/api/client';
import { API_ENDPOINTS } from '@/shared/lib/api/endpoints';

/**
 * 서버 생성 API
 * @param data - 서버 생성 요청 데이터
 * @returns - 서버 생성 응답 데이터
 */
export async function createServer(
  data: ServerCreateSchema
): Promise<ApiResponse<ServerCreateResponse>> {
  const response = await client.post<ApiResponse<ServerCreateResponse>>(
    API_ENDPOINTS.SERVER.CREATE,
    data
  );

  return response.data;
}

/**
 * 서버 목록 조회 API
 * @returns - 서버 목록 응답 데이터
 */
export async function getServerList(
  params: ServerListParams
): Promise<ApiResponse<ServerListResponse>> {
  const response = await client.get<ApiResponse<ServerListResponse>>(
    API_ENDPOINTS.SERVER.LIST(params)
  );

  return response.data;
}

/**
 * 내 서버 목록 조회 API
 * @returns - 내 서버 목록 응답 데이터
 */
export async function getMyServerList(): Promise<
  ApiResponse<ServerListResponse>
> {
  const response = await client.get<ApiResponse<ServerListResponse>>(
    API_ENDPOINTS.SERVER.MY_SERVERS
  );

  return response.data;
}

/**
 * 서버 전체 태그 목록 조회 API
 */
export async function getServerTagList(): Promise<
  ApiResponse<ServerTagListResponse>
> {
  const response = await client.get<ApiResponse<ServerTagListResponse>>(
    API_ENDPOINTS.SERVER.TAGS
  );

  return response.data;
}
