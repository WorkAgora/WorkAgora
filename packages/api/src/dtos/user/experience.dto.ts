import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class DeleteExperienceDTO {
  @ApiProperty({
    description: 'The id of the experience',
    type: String,
    required: true
  })
  @IsString()
  id: string;
}

export class UpdateExperienceDTO {
  @ApiProperty({
    description: 'The id of the experience',
    type: String,
    required: true
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The role of the user',
    type: String,
    required: true
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'The company of the user',
    type: String,
    required: true
  })
  @IsString()
  company: string;

  @ApiProperty({
    description: 'The description of the user',
    type: String,
    required: true
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The start date of the user',
    type: String,
    required: true
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'The end date of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'The image url of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class ExperienceDTO {
  @ApiProperty({
    description: 'The role of the user',
    type: String,
    required: true
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'The company of the user',
    type: String,
    required: true
  })
  @IsString()
  company: string;

  @ApiProperty({
    description: 'The description of the user',
    type: String,
    required: true
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The start date of the user',
    type: String,
    required: true
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'The end date of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'The image url of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
