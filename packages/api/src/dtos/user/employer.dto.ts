import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class EmployerDTO {
  @ApiProperty({
    description: 'The company ID linked to the user',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  companyId?: string;
}
