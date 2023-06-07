import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobProposalDTO {
  @ApiProperty({
    description: 'The price of the job proposal (USD)',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  priceUsd: number;

  @ApiProperty({
    description: 'Token used for payment',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  token: number;

  @ApiProperty({
    description: 'Initial deposit percentage',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  initialDepositPct: number;

  @ApiProperty({
    description: 'Locked amount percentage',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  lockedAmountPct: number;

  @ApiProperty({
    description: 'Deferred amount percentage',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  deferredAmountPct: number;

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
    description: 'The work duration of the job proposal (in days)',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  durationInDay: number;

  @ApiProperty({
    description: 'The creation expiry timestamp of the job proposal',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  creationExpiryTimestamp: string;

  @ApiProperty({
    description: 'The freelancer wallet address',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  freelancerWallet: string;

  @ApiProperty({
    description: 'The company wallet address',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  companyWallet: string;
}
