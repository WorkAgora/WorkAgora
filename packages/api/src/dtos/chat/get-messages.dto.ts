import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetMessagesDto {
  @ApiProperty({ description: 'InstanceId (INSTANCE#wallet1#wallet2)' })
  @IsString()
  instanceId: string;

  @ApiProperty({ description: 'LIMIT', default: 10 })
  @IsNumber()
  limit: number;

  @ApiProperty({ description: 'Page', default: 1 })
  @IsNumber()
  page: number;
}
