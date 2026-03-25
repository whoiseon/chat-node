import {
  CreateChannelDto,
  CreateChannelResponseDto,
  CreateDmDto,
  CreateDmResponseDto,
} from '@repo/api-types';

import { api } from '@/lib/api';

export const channelApi = {
  createChannel: async (
    params: CreateChannelDto,
  ): Promise<CreateChannelResponseDto> => {
    return api.post('/channel', params);
  },

  createDm: async (params: CreateDmDto): Promise<CreateDmResponseDto> => {
    return api.post('/channel/dm', params);
  },
};

export const channelKeys = {
  all: ['channel'] as const,
};
