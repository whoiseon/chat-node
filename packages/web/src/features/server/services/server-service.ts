import { ApiResponse } from '@/shared/lib/api/types';
import { ServerCreateSchema } from '../schemas/create-server.schema';
import {
  ServerCreateResponse,
  ServerListResponse,
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
export async function getServerList(): Promise<
  ApiResponse<ServerListResponse>
> {
  const response = await client.get<ApiResponse<ServerListResponse>>(
    API_ENDPOINTS.SERVER.LIST
  );

  return response.data;
}
