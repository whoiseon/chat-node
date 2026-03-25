import {
  CreateChannelDto,
  CreateChannelResponseDto,
  CreateDmDto,
  CreateDmResponseDto,
  GetChannelsQueryDto,
  GetChannelsResponseDto,
} from '@repo/api-types';

import { api } from '@/lib/api';

export const channelApi = {
  createChannel: (
    params: CreateChannelDto,
  ): Promise<CreateChannelResponseDto> => {
    return api.post('/channel', params);
  },

  createDm: (params: CreateDmDto): Promise<CreateDmResponseDto> => {
    return api.post('/channel/dm', params);
  },

  getChannels: (
    query: GetChannelsQueryDto,
  ): Promise<GetChannelsResponseDto> => {
    return api.get('/channel', { params: query });
  },
};

export const channelKeys = {
  all: ['channel'] as const,
  listAll: ['channel', 'list'] as const,
  list: (query: GetChannelsQueryDto) =>
    ['channel', 'list', 'query', query] as const,
};
