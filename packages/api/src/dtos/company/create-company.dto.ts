import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDTO {
  @ApiProperty({ description: 'Company Name', example: 'Company Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Company Title', example: 'Company Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Company Description', example: 'Company Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Company Logo URL', example: 'Company Logo URL' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ description: 'Company Website URL', example: 'Company Website URL' })
  @IsString()
  @IsOptional()
  websiteUrl?: string;
}
