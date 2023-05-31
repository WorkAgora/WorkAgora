import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';
import { ChatMessageDTO } from './chat.dto';

export class GetMessagesDto {
  @ApiProperty({description: "InstanceId (PK)"})
  @IsString()
  instanceId: string;

  // LIMIT and page
  @ApiProperty({description: "LIMIT"})
  @IsNumber()
  limit: number;

  @ApiProperty({description: "Page"})
  @IsNumber()
  page: number;
}
