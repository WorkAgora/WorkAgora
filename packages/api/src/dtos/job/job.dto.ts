import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { Visibility, WorkAvailability } from '../../../../utils/src/interfaces/job';

export class ConfirmJobContractDTO {
  @ApiProperty({ description: 'The employer wallet' })
  employerWallet: string;
  @ApiProperty({ description: 'The contractor wallet' })
  contractorWallet: string;
  @ApiProperty({ description: 'Contractor Price' })
  contractPrice: number;
  @ApiProperty({ description: 'Contractor Description' })
  contractDescription: string;
  @ApiProperty({ description: 'Contractor Tags' })
  contractTags: string[];
  @ApiProperty({ description: 'Contractor Duration' })
  contractDuration: string;
  @ApiProperty({ description: 'Contractor Start Expiry Date' })
  contractStartExpiryDate: string;
}

export class DurationDTO {
  @ApiProperty({ description: 'Years' })
  @IsNotEmpty()
  @IsNumber()
  years: number;
  @ApiProperty({ description: 'Months' })
  @IsNotEmpty()
  @IsNumber()
  months: number;
  @ApiProperty({ description: 'Days' })
  @IsNotEmpty()
  @IsNumber()
  days: number;
  @ApiProperty({ description: 'Hours' })
  @IsNotEmpty()
  @IsNumber()
  hours: number;
}

export class JobContractSignatureDTO {
  @ApiProperty({ description: 'Contractor signature' })
  @IsString()
  contractorSignature: string;

  @ApiProperty({ description: 'Employer signature' })
  @IsString()
  employerSignature: string;
}

export class CreateJobDTO {
  @ApiProperty({ description: 'The Job Title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The Work Location' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'The Work Availability' })
  @IsString()
  availability: WorkAvailability;

  @ApiProperty({ description: 'Work Duration' })
  @IsObject()
  duration: DurationDTO;

  @ApiProperty({ description: 'The Job Description' })
  @IsString()
  jobMission: string;

  @ApiProperty({ description: 'The Job Responsibilities' })
  @IsString()
  responsibilities: string;

  @ApiProperty({ description: 'The Job Requirements' })
  @IsString()
  requirements: string;

  @ApiProperty({ description: 'The Job Tags (Skills & Expertise)' })
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'The Job Visibility' })
  @IsString()
  visibility: Visibility;

  @ApiProperty({ description: 'Company UUID' })
  @IsString()
  companyUuid: string;
}

export class CompleteJobContractDTO extends ConfirmJobContractDTO {
  @ApiProperty({ type: JobContractSignatureDTO })
  signatures: JobContractSignatureDTO;
}
