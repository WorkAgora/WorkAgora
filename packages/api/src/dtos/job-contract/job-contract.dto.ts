import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {CreateJobProposalDTO} from "./job-proposal-dto";

export class JobContractDTO {
  @ApiProperty({
    description: 'The UUID of the job contract',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @ApiProperty({
    description: 'The wallet of the employer',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  employerWallet: string;

  @ApiProperty({
    description: 'The wallet of the contractor',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  contractorWallet: string;

  @ApiProperty({
    description: 'The job proposal of the contract',
    type: CreateJobProposalDTO,
    required: true
  })
  @IsNotEmpty()
  jobProposal: CreateJobProposalDTO;

  @ApiProperty({
    description: 'The creation date of the job contract',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  createdAt: string;

  @ApiProperty({
    description: 'The CID of the JSON file containing the job contract',
    type: String,
    required: false
  })
  @IsString()
  cid?: string;
}
