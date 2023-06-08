import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompanyDTO {
  @ApiProperty({ description: 'Company Unique Identifier', example: '123e4567-e89b-12d3-a456-426655440000' })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ description: 'Company Wallet', example: '0x3D980E50508CFd41a13837A60149927a11c03731' })
  @IsString()
  @IsNotEmpty()
  companyWallet: string;

  @ApiProperty({ description: 'Company Name', example: 'OpenAI' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Company Title', example: 'Artificial Intelligence Company' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Company Description', example: 'We are focused on ensuring that artificial general intelligence (AGI) benefits all of humanity.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Company Logo URL', example: 'https://openai.com/logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ description: 'Company Website URL', example: 'https://openai.com' })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ description: 'Company Location', example: 'San Francisco, CA' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Creation date', example: '2023-06-01T00:00:00Z' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;
}
