import { ApiProperty } from '@nestjs/swagger';
import { CreateChatMessageDTO } from './create-chat.dto';

export class ChatConversationDTO {
  @ApiProperty({ description: 'The ID of the partner in the conversation' })
  partnerWallet: string;

  @ApiProperty({ description: 'The last message in the conversation', type: CreateChatMessageDTO })
  lastMessage: CreateChatMessageDTO;
}
