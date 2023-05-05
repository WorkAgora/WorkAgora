import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { SynapsService } from './synaps.service';

@Module({
  imports: [],
  controllers: [KycController],
  providers: [KycService, SynapsService],
})
export class KycModule {}
