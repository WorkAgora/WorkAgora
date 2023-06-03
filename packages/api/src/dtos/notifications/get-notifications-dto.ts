import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetNotificationsDTO {
  @ApiProperty({
    description: 'The page number of notifications',
    type: Number,
    required: true
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'The number of notifications per page',
    type: Number,
    required: true
  })
  @IsNumber()
  limit: number;
}
