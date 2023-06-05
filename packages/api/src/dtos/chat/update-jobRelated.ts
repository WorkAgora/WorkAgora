import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateJobRelatedDTO {
  @ApiProperty({ description: 'Unique identifier of the chat instance (INSTANCE#wallet1#wallet2)' })
  @IsString()
  jobRelated: string;

  @ApiProperty({ description: 'Chat instance Id' })
  @IsString()
  instanceId: string;
}
