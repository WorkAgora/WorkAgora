import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class FreelanceDTO {
  @ApiProperty({
    description: 'The skills of the user',
    type: Array,
    required: false
  })
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    description: 'The long description of what the user do',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  longDesc?: string;

  @ApiProperty({
    description: 'The situation of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  situation?: string;

  @ApiProperty({
    description: 'The availability of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  availability?: string;

  @ApiProperty({
    description: 'The hours per week of the user',
    type: Number,
    required: false
  })
  @IsString()
  @IsOptional()
  hoursPerWeek?: number;

  @ApiProperty({
    description: 'The years of experience of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  yearsOfExperience?: string;

  @ApiProperty({
    description: 'The certificates of the user',
    type: Array,
    required: false
  })
  @IsArray()
  @IsOptional()
  certificates?: string[];

  @ApiProperty({
    description: 'The remuneration of the user',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  remuneration?: string;
}
