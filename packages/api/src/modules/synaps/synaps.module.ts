import { Module } from '@nestjs/common';
import { SynapsService } from './synaps.service';
import { HttpModule } from '@nestjs/axios';
import { DynamooseModule } from 'nestjs-dynamoose';
import { SynapsSessionSchema } from './synaps.schema';

@Module({
  imports: [
    HttpModule,
    DynamooseModule.forFeature([
      {
        name: 'Session',
        schema: SynapsSessionSchema,
        options: {
          tableName: '-synaps-session'
        }
      }
    ])
  ],
  providers: [SynapsService],
  exports: [SynapsService]
})
export class SynapsModule {}
