import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JobContractFinalizationDTO {
  @ApiProperty({
    description: 'The UUID of the job contract',
    type: String,
    required: true
  })
  @IsString()
  jobContractUuid: string;

  @ApiProperty({
    description: 'The file hash',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  fileHash?: string;

  @ApiProperty({
    description: 'The review',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  review?: string;
}
