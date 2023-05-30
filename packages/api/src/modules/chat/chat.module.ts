import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatMessageSchema } from './chat.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Chat',
        schema: ChatMessageSchema,
        options: {
          tableName: '-chat'
        }
      }
    ])
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
