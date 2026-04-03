import { GetMessagesQueryDto, GetMessagesResponseDto } from '@repo/api-types';

import { api, serverApi } from '@/lib/api';

export const messagesApi = {
  getMessages: (
    query: GetMessagesQueryDto,
    cookie?: string,
  ): Promise<GetMessagesResponseDto> => {
    if (cookie) {
      return serverApi.get('/messages', cookie, { params: query });
    }
    return api.get('/messages', { params: query });
  },
};

export const messageKeys = {
  all: ['messages'] as const,
  list: (query: GetMessagesQueryDto) =>
    ['messages', 'list', 'query', query] as const,
};
