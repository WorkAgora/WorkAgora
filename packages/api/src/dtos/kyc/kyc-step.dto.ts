import {
  IsString, IsIn, IsNotEmpty, Matches
} from 'class-validator';
import {walletRegex} from '../../../../utils/src/index';
import {KycService, KycServiceState} from "../../modules/kyc/kyc.enum";
import {ApiProperty} from "@nestjs/swagger";

export class KycStepDto {
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
    description: 'The service name',
    type: String,
    required: true,
    example: '0x0'
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(KycService))
  serviceName: KycService;

  @ApiProperty({
    description: 'The service state',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(KycServiceState))
  state: KycServiceState;

  @ApiProperty({
    description: 'The session ID (UUIDV4)',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;
}
