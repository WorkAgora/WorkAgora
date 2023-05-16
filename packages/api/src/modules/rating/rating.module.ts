import { Module } from '@nestjs/common';
import {RatingService} from "./rating.service";
import {RatingController} from "./rating.controller";
import {DynamooseModule} from "nestjs-dynamoose";
import {RatingSchema} from "./rating.schema";

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Rating',
        schema: RatingSchema,
        options: {
          tableName: '-rating'
        }
      }
  ])
  ],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService]
})
export class RatingModule {}
