import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsDate,
  IsObject,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { FreelancerProfile, EmployerProfile } from '../../modules/user/user.interface';
import { UpdateFreelanceProfileDTO } from './update-freelance.dto';
import { UpdateEmployerProfileDTO } from './update-employer.dto';

export class UserDTO {
  @ApiProperty({
    description: 'The wallet address of the user',
    type: String,
    required: true,
    example: '0x0'
  })
  @IsString()
  wallet: string;

  @ApiProperty({
    description: 'The email address of the user',
    type: String,
    example: 'test@test.com',
    required: true
  })
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  language?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsArray()
  links?: string[];

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @ApiProperty({ type: UpdateFreelanceProfileDTO })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateFreelanceProfileDTO)
  workProfile?: UpdateFreelanceProfileDTO;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: UpdateEmployerProfileDTO })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateEmployerProfileDTO)
  employerProfile?: UpdateEmployerProfileDTO;

  @IsOptional()
  @IsString()
  currentUserType?: string;

  @IsOptional()
  @IsDate()
  tosAcceptedOn?: Date;
}
