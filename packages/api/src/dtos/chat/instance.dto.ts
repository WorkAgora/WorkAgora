import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ChatMessageDTO } from './chat.dto';

export class ChatInstanceDTO {
  @ApiProperty({ description: 'Unique identifier of the chat instance (INSTANCE#wallet1#wallet2)' })
  @IsString()
  uuid: string;

  @ApiProperty({ description: 'My wallet address in this chat instance' })
  @IsString()
  myWallet: string;

  @ApiProperty({ description: "Partner's wallet address in this chat instance" })
  @IsString()
  partnerWallet: string;

  @ApiProperty({ description: 'Last message in this chat instance', type: ChatMessageDTO })
  lastMessage: ChatMessageDTO;

  @ApiProperty({ description: 'Author type of the partner in this chat instance' })
  @IsString()
  partnerType: string;
}
