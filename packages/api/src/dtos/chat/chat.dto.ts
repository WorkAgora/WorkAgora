import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatMessageDTO {
  @ApiProperty({
    description: 'UUID of the message',
    example: '00000000-0000-0000-0000-000000000000',
    required: true
  })
  @IsString()
  uuid: string;

  @ApiProperty({
    description: 'Sender wallet address',
    example: '0x00000',
    required: true
  })
  @IsString()
  senderWallet: string;

  @ApiProperty({
    description: 'Receiver wallet address',
    example: '0x00001',
    required: true
  })
  @IsString()
  receiverWallet: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello world!',
    required: true
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Message timestamp',
    example: '2021-01-01T00:00:00.000Z',
    required: true
  })
  @IsString()
  createdAt: string;
}
