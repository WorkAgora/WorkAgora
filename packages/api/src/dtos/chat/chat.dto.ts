import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatMessageDTO {
  @ApiProperty({ description: 'Unique identifier of the chat message' })
  @IsString()
  uuid: string;

  @ApiProperty({ description: 'Wallet address of the sender' })
  @IsString()
  senderWallet: string;

  @ApiProperty({ description: 'Wallet address of the receiver' })
  @IsString()
  receiverWallet: string;

  @ApiProperty({ description: 'Content of the message' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Timestamp when the message was created' })
  @IsString()
  createdAt: string;
}
