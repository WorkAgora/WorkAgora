import {
  IsString, IsIn, IsNotEmpty, Matches
} from 'class-validator';
import {walletRegex} from '../../../../utils/src/index';
import {KycStatus} from "../../modules/kyc/kyc.enum";
import {KycStepDto} from "./kyc-step.dto";
import {ApiProperty} from "@nestjs/swagger";

export class KycSessionDto {
  @ApiProperty({
    description: 'The wallet address of the user',
    type: String,
    required: true,
    example: '0x0'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(walletRegex)
  wallet: string;

  @ApiProperty({
    description: 'The session ID (UUIDV4)',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'The status of the KYC session',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(KycStatus))
  status: KycStatus;

  @ApiProperty({
    description: 'The steps of the KYC session',
    type: [KycStepDto],
    required: true,
  })
  steps: KycStepDto[];
}
