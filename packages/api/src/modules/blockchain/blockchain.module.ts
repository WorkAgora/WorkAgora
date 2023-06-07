import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { JobContractModule } from '../job-contract/jobContract.module';
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    JobContractModule,
      NotificationsModule
  ],
  controllers: [],
  providers: [BlockchainService],
  exports: [BlockchainService]
})
export class BlockchainModule {}
