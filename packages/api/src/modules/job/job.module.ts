import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobSchema } from './job.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Job',
        schema: JobSchema,
        options: {
          tableName: '-job'
        }
      }
    ])
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService]
})
export class JobModule {}
