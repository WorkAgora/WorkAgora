import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import {DynamooseModule} from "nestjs-dynamoose";
import {KycSessionSchema} from "./kyc.schema";
import {HttpModule} from "@nestjs/axios";

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
      ]),
    HttpModule
  ],
  controllers: [KycController],
  providers: [KycService],
  // exports: [KycService]
})
export class KycModule {}
