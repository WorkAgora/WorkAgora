import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import {ChatMessageDTO} from "../../dtos/chat/chat.dto";
import {JwtAuthGuard} from "../auth/jwt.guard";
import {CreateChatMessageDTO} from "../../dtos/chat/create-chat.dto";
import {ChatMessage} from "./chat.interface";
import {Request} from "express";
import {ChatInstanceDTO} from "../../dtos/chat/instance.dto";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  // @UseGuards(JwtAuthGuard)
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
    // const { wallet } = req.user;
    // if (wallet !== message.senderWallet) {
    //   throw new Error('Sender wallet is required');
    // }
    return this.chatService.sendMessage('wallet', message);
  }

  @Get('conversations')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all conversations related to a specific wallet' })
  @ApiResponse({
    status: 200,
    description: 'List of conversations',
    type: [ChatInstanceDTO], // or any suitable type
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getConversations(
    @Req() req: Request,
  ) {
    // const { wallet } = req.user;
    return this.chatService.getConversations("wallet");
  }
}
