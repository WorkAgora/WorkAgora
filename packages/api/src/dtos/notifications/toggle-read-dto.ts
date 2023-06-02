import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ToggleReadStatusDTO {
  @ApiProperty({
    description: 'The ID of the notification',
    type: String,
    required: true
  })
  @IsString()
  notificationId: string;
}
