import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiResponseDto } from '@/common/dto';
import {
  GetMessagesQueryDto,
  GetMessagesResponseDto,
} from '@/features/messages/dto';
import { MessagesService } from '@/features/messages/messages.service';

@Controller('messages')
@ApiTags('messages')
@ApiExtraModels(GetMessagesQueryDto)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('')
  @ApiOperation({
    summary: '대화 내역 조회',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: GetMessagesResponseDto,
  })
  async getMessages(@Query() query: GetMessagesQueryDto) {
    const result = await this.messagesService.getMessages(query);
    return new ApiResponseDto(result);
  }
}
