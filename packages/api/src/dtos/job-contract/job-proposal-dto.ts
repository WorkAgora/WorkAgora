import { IsString, IsNotEmpty, IsNumber, IsArray, IsDateString, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DurationDTO } from '../job/job.dto';
import { JobContractStatus } from "../../modules/job-contract/job-contract.interface";

export class CreateJobProposalDTO {
  @ApiProperty({
    description: 'The UUID of the job proposal',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @ApiProperty({
    description: 'The price of the job proposal (USD)',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The description of the job proposal',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The tags of the job proposal',
    type: [String],
    required: true
  })
  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @ApiProperty({
    description: 'The work duration of the job proposal',
    type: DurationDTO,
    required: true
  })
  @IsNotEmpty()
  duration: DurationDTO;

  @ApiProperty({
    description: 'The start expiry date of the job proposal',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsDateString()
  startExpiryDate: string;

  @ApiProperty({
    description: 'The UUID of the job',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  jobUuid: string;

  @ApiProperty({
    description: 'The creation date of the job proposal',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Item Open/Closed Status',
    type: Number,
    required: true
  })
  @IsNumber()
  @IsEnum(JobContractStatus)
  open: JobContractStatus;

  @ApiProperty({
    description: "The freelancer validation status",
    type: Boolean,
    required: true
  })
  @IsBoolean()
  freelancerValidationStatus: boolean;

  @ApiProperty({
    description: 'The Wallet of the freelancer',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  freelancerWallet: string;
}
