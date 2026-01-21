import z from 'zod';

import { serverCreateSchema } from './server.schema';

export type ServerCreateInput = z.infer<typeof serverCreateSchema>;

export type ServerCreateResponse = {
  serverId: string;
  slug: string;
};

export interface ServerRow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tags?: string[];
  createdAt?: Date;
  manager?: {
    id: string;
    username: string;
    mainNodeConId: string;
  };
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

export interface ServerFavoriteAddInput {
  serverId: string;
}

export interface ServerFavoriteAddResponse {
  serverId: string;
}

export interface ServerFavoriteRemoveResponse {
  serverId: string;
}
