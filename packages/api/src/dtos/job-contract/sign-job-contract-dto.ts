import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignJobContractDTO {
  @ApiProperty({ description: 'Signature string' })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ description: 'JobProposal Id string' })
  @IsString()
  @IsNotEmpty()
  jobProposalId: string;
}
