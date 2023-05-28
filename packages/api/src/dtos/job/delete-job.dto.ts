import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteJobDTO {
  @ApiProperty({ description: 'The job id', example: 'UUIDV4' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The reason for deleting the job', example: 'I found someone else' })
  @IsString()
  reason?: string;
}
