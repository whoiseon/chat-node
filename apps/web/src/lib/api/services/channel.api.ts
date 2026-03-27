import {
  CreateChannelDto,
  CreateChannelResponseDto,
  CreateDmDto,
  CreateDmResponseDto,
  GetChannelResponseDto,
  GetChannelsQueryDto,
  GetChannelsResponseDto,
  JoinChannelDto,
  JoinChannelResponseDto,
} from '@repo/api-types';

import { api, serverApi } from '@/lib/api';

export const channelApi = {
  createChannel: (
    params: CreateChannelDto,
  ): Promise<CreateChannelResponseDto> => {
    return api.post('/channel', params);
  },

  createDm: (params: CreateDmDto): Promise<CreateDmResponseDto> => {
    return api.post('/channel/dm', params);
  },

  joinChannel: (
    params: JoinChannelDto & { channelId: string },
  ): Promise<JoinChannelResponseDto> => {
    const { channelId, ...rest } = params;
    return api.post(`/channel/${channelId}/join`, rest);
  },

  getChannels: (
    query: GetChannelsQueryDto,
    cookie?: string,
  ): Promise<GetChannelsResponseDto> => {
    if (cookie) {
      return serverApi.get('/channel', cookie, { params: query });
    }
    return api.get('/channel', { params: query });
  },

  getChannel: (
    channelId: string,
    cookie?: string,
  ): Promise<GetChannelResponseDto> => {
    if (cookie) {
      return serverApi.get(`/channel/${channelId}`, cookie);
    }
    return api.get(`/channel/${channelId}`);
  },
};

export const channelKeys = {
  all: ['channel'] as const,
  listAll: ['channel', 'list'] as const,
  list: (query: GetChannelsQueryDto) =>
    ['channel', 'list', 'query', query] as const,
  detail: (channelId: string) => ['channel', 'detail', channelId] as const,
};
