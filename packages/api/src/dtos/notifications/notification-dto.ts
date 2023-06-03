import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NotificationDTO {
  @ApiProperty({
    description: 'The user wallet',
    type: String,
    required: true
  })
  @IsString()
  userWallet: string;

  @ApiProperty({
    description: 'The notification title',
    type: String,
    required: true
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The notification message',
    type: String,
    required: true
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The notification type',
    type: String,
    required: true
  })
  @IsString()
  type: string;

  // createdAt String, ID String
  @ApiProperty({
    description: 'The notification creation date',
    type: String,
    required: true
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    description: 'The notification id',
    type: String,
    required: true
  })
  @IsString()
  id: string;
}
