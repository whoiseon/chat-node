import {
  CreateChannelDto,
  CreateChannelResponseDto,
  CreateDmDto,
  CreateDmResponseDto,
  GetChannelMeResponseDto,
  GetChannelResponseDto,
  GetChannelsQueryDto,
  GetChannelsResponseDto,
  JoinChannelDto,
  JoinChannelResponseDto,
  NullPayloadResponseDto,
} from '@repo/api-types';

import { api, serverApi } from '@/lib/api';

export const channelsApi = {
  createChannel: (
    params: CreateChannelDto,
  ): Promise<CreateChannelResponseDto> => {
    return api.post('/channels', params);
  },

  createDm: (params: CreateDmDto): Promise<CreateDmResponseDto> => {
    return api.post('/channels/dm', params);
  },

  joinChannel: (
    params: JoinChannelDto & { channelId: string },
  ): Promise<JoinChannelResponseDto> => {
    const { channelId, ...rest } = params;
    return api.post(`/channels/${channelId}/join`, rest);
  },

  getChannels: (
    query: GetChannelsQueryDto,
    cookie?: string,
  ): Promise<GetChannelsResponseDto> => {
    if (cookie) {
      return serverApi.get('/channel', cookie, { params: query });
    }
    return api.get('/channels', { params: query });
  },

  getChannel: (
    channelId: string,
    cookie?: string,
  ): Promise<GetChannelResponseDto> => {
    if (cookie) {
      return serverApi.get(`/channels/${channelId}`, cookie);
    }
    return api.get(`/channels/${channelId}`);
  },

  getChannelMe: (
    channelId: string,
    cookie?: string,
  ): Promise<GetChannelMeResponseDto> => {
    if (cookie) {
      return serverApi.get(`/channels/${channelId}/me`, cookie);
    }
    return api.get(`/channels/${channelId}/me`);
  },

  readChannel: (channelId: string): Promise<NullPayloadResponseDto> => {
    return api.patch(`/channels/${channelId}/read`);
  },
};

export const channelKeys = {
  all: ['channels'] as const,
  listAll: ['channels', 'list'] as const,
  list: (query: GetChannelsQueryDto) =>
    ['channels', 'list', 'query', query] as const,
  detail: (channelId: string) => ['channels', 'detail', channelId] as const,
  me: (channelId: string) =>
    ['channels', 'me', 'channelId', channelId] as const,
};
