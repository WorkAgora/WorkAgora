import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChatAuthorType } from '../../modules/chat/chat.interface';

export class CreateChatMessageDTO {
  @ApiProperty({ description: 'Wallet address of the sender' })
  @IsString()
  senderWallet: string;

  @ApiProperty({ description: 'Wallet address of the receiver' })
  @IsString()
  receiverWallet: string;

  @ApiProperty({ description: 'Content of the message' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Author type of the sender in this chat message' })
  @IsString()
  @IsOptional()
  @IsEnum(ChatAuthorType)
  partnerType?: ChatAuthorType;
}
