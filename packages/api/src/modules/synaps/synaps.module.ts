import { Module } from '@nestjs/common';
import { SynapsService } from './synaps.service';
import { HttpModule } from '@nestjs/axios';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
  imports: [
    HttpModule,
    DynamooseModule.forFeature([
      {
        name: 'Session',
        schema: { sessionId: String, alias: String, sandbox: Boolean },
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
