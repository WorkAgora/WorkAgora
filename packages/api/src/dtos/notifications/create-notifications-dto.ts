import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../../modules/notifications/notifications.interface';
import { IsEnum, IsString } from 'class-validator';

export class CreateNotificationDTO {
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
    required: true,
    enum: NotificationType
  })
  @IsString()
  @IsEnum(NotificationType)
  type: string;
}
