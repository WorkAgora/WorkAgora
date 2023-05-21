import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { KycService, KycServiceState } from '../../modules/kyc/kyc.enum';
import { ApiProperty } from '@nestjs/swagger';

export class KycStepDTO {
  @ApiProperty({
    description: 'The service name',
    type: String,
    required: true,
    example: 'LIVENESS|IDENTITY|RESIDENCY'
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(KycService))
  serviceName: KycService;

  @ApiProperty({
    description: 'The service state',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(KycServiceState))
  state: KycServiceState;
}
