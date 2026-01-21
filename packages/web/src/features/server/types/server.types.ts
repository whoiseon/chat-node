import { UserResponse } from '@/features/user/types/user.types';

export type ServerCreateResponse = {
  serverId: string;
  slug: string;
};

export const SERVER_JOIN_TYPE = {
  DIRECT: 'DIRECT',
  APPROVAL: 'APPROVAL',
  PRIVATE: 'PRIVATE',
} as const;

export interface ServerRow {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  createdAt?: string;
  tags?: string[];
  manager?: UserResponse;
  memberCount?: number;
  favoriteCount?: number;
}

export interface ServerListResponse {
  rows: ServerRow[];
  totalCount: number;
}

export interface ServerTagRow {
  name: string;
  totalCount: number;
}

export interface ServerTagListResponse {
  rows: ServerTagRow[];
  totalCount: number;
}

export interface ServerListParams {
  tags?: string;
  search?: string;
  search_target?: string;
}

export interface FavoriteAddParams {
  serverId: string;
}

export interface FavoriteRemoveParams {
  serverId: string;
}
