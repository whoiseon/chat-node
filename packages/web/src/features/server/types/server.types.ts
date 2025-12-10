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
  imageUrl: string;
  description: string;
  slug: string;
  createdAt: string;
  tags: string[];
  manager: UserResponse;
  memberCount: number;
  favoriteCount: number;
}

export interface ServerListResponse {
  rows: ServerRow[];
  totalCount: number;
}
