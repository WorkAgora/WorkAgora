import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { ChatConversation, ChatMessage } from './chat.interface';
import { CreateChatMessageDTO } from '../../dtos/chat/create-chat.dto';
import { ChatConversationDTO } from '../../dtos/chat/conversation-chat.dto';
import { ChatMessageDTO } from '../../dtos/chat/chat.dto';

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
  ): Promise<ChatMessageDTO> {
    const { wallet } = req.user;
    if (wallet !== message.senderWallet) {
      throw new Error('Sender wallet is required');
    }
    return this.chatService.sendMessage(wallet, message.receiverWallet, message.content);
  }

  @Get('/conversations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all conversations of a user' })
  @ApiResponse({
    status: 200,
    description: 'The conversations of the user',
    type: [ChatConversationDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getConversations(@Req() req: Request): Promise<ChatConversation[]> {
    const { wallet } = req.user;
    return await this.chatService.getConversations(wallet);
  }

  @Get('/:wallet')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get chat messages for a user' })
  @ApiResponse({
    status: 200,
    description: 'The chat messages between the current user and an other',
    type: [CreateChatMessageDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getMessages(@Req() req: Request, @Param('wallet') to: string): Promise<ChatMessage[]> {
    const { wallet } = req.user;
    return this.chatService.getMessages(wallet, to);
  }
}
