import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatMessageDTO } from '../../dtos/chat/chat.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateChatMessageDTO } from '../../dtos/chat/create-chat.dto';
import { ChatMessage } from '@workagora/utils';
import { Request } from 'express';
import { ChatInstanceDTO } from '../../dtos/chat/instance.dto';
import { ToggleVisibilityDto } from '../../dtos/chat/toggle-visibility.dto';
import { GetMessagesDto } from '../../dtos/chat/get-messages.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiBody({ type: CreateChatMessageDTO })
  @ApiResponse({
    status: 200,
    description: 'The sent chat message',
    type: CreateChatMessageDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async sendMessage(
    @Req() req: Request,
    @Body() message: CreateChatMessageDTO
  ): Promise<ChatMessage> {
    const { wallet } = req.user;
    if (wallet !== message.senderWallet) {
      throw new Error('Sender wallet is required');
    }
    return this.chatService.sendMessage('wallet', message);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all conversations related to a specific wallet' })
  @ApiResponse({
    status: 200,
    description: 'List of conversations',
    type: [ChatInstanceDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getConversations(@Req() req: Request) {
    const { wallet } = req.user;
    return this.chatService.getConversations(wallet);
  }

  @Post('toggle-visibility')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle the visibility of a chat instance' })
  @ApiBody({ type: ToggleVisibilityDto })
  @ApiResponse({
    status: 200,
    description: 'Visibility toggled successfully',
    type: Boolean
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async toggleVisibility(
    @Req() req: Request,
    @Body() instance: ToggleVisibilityDto
  ): Promise<boolean> {
    const { wallet } = req.user;
    return this.chatService.toggleVisibility(wallet, instance);
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get chat messages for a specific instance' })
  @ApiQuery({ name: 'instanceId', required: true, type: String, description: 'InstanceId' })
  @ApiQuery({ name: 'limit', required: true, type: Number, description: 'Limit' })
  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page' })
  @ApiResponse({
    status: 200,
    description: 'List of chat messages',
    type: [ChatMessageDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getMessages(
    @Req() req: Request,
    @Query('instanceId') instanceId: string,
    @Query('limit') limit: number,
    @Query('page') page: number
  ) {
    const { wallet } = req.user;
    const instance: GetMessagesDto = { instanceId, limit, page };
    return this.chatService.getMessages(wallet, instance);
  }
}
