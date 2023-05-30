import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatMessageDTO {
  @ApiProperty({
    description: 'Sender wallet address',
    example: '0x00000',
    required: true
  })
  @IsString()
  senderWallet: string;
  @ApiProperty({
    description: 'Sender wallet address',
    example: '0x00000',
    required: true
  })
  @IsString()
  receiverWallet: string;
  @ApiProperty({
    description: 'Sender wallet address',
    example: '0x00000',
    required: true
  })
  @IsString()
  content: string;
}
