import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import {ChatSchema} from "./chat.schema";
import {DynamooseModule} from "nestjs-dynamoose";

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Chat',
        schema: ChatSchema,
        options: {
          tableName: '-chat'
        }
      },
    ])
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
