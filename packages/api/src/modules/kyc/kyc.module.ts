import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { SynapsService } from '../synaps/synaps.service';
import {DynamooseModule} from "nestjs-dynamoose";
import {KycSessionSchema} from "./kyc.schema";

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'KycSession',
        schema: KycSessionSchema,
        options: {
          tableName: '-kyc-session'
        }
      },
      ])
  ],
  controllers: [KycController],
  providers: [KycService, SynapsService],
})
export class KycModule {}
