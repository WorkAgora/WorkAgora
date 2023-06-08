import { Module } from '@nestjs/common';
import { JobContractService } from './jobContract.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { JobContractSchema } from './job-contract.schema';
import { JobContractController } from './jobContract.controller';
import { JobService } from '../job/job.service';
import { JobModule } from '../job/job.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'JobContract',
        schema: JobContractSchema,
        options: {
          tableName: '-job-contract'
        }
      }
    ]),
    JobModule,
    CompanyModule
  ],
  controllers: [JobContractController],
  providers: [JobContractService],
  exports: [JobContractService]
})
export class JobContractModule {}
