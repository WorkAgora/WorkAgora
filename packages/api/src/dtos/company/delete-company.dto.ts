import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCompanyDTO {
  @ApiProperty({ description: 'The company uuid', example: 'UUIDV4' })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ description: 'The reason for deleting the company', example: '...' })
  @IsString()
  reason?: string;
}
