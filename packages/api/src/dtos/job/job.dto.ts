import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateJobContractDTO {
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

export class JobContractSignatureDTO {
  @ApiProperty({ description: 'Contractor signature' })
  @IsString()
  contractorSignature: string;

  @ApiProperty({ description: 'Employer signature' })
  @IsString()
  employerSignature: string;
}

export class CompleteJobContractDTO extends CreateJobContractDTO {
  @ApiProperty({ type: JobContractSignatureDTO })
  signatures: JobContractSignatureDTO;
}
