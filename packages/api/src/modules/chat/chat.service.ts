import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { ChatInstance, ChatItemKey, ChatMessage } from './chat.interface';
import { CreateChatMessageDTO } from '../../dtos/chat/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatModel: Model<ChatMessage, ChatItemKey>,
    private readonly instanceModel: Model<ChatInstance, ChatItemKey>
  ) {}

  async sendMessage(currentWallet: string, message: CreateChatMessageDTO) {
    try {
      const { senderWallet, receiverWallet, content, partnerType } = message;
      if (senderWallet !== currentWallet) {
        throw new HttpException(
          'You are not allowed to send messages on behalf of another wallet',
          403
        );
      }
      if (senderWallet === receiverWallet) {
        throw new HttpException('You are not allowed to send messages to yourself', 403);
      }

      const createdAt = new Date().toISOString();

      // Create new message
      const newMessage: ChatMessage = {
        PK: `MESSAGE#${uuidv4()}`,
        SK: `${senderWallet}#${receiverWallet}`,
        content: content,
        receiverWallet: receiverWallet,
        senderWallet: senderWallet,
        createdAt: createdAt,
      };
      await this.chatModel.create(newMessage);

      // Query for chat instances where myWallet equals senderWallet and partnerWallet equals receiverWallet
      const chatInstance1 = await this.instanceModel
        .query('PK')
        .eq(`INSTANCE#${senderWallet}#${receiverWallet}`)
        .exec();

      // Query for chat instances where myWallet equals receiverWallet and partnerWallet equals senderWallet
      const chatInstance2 = await this.instanceModel
        .query('PK')
        .eq(`INSTANCE#${receiverWallet}#${senderWallet}`)
        .exec();

      // Combine the results
      const chatInstances = [...chatInstance1, ...chatInstance2];
      if (chatInstances.length === 0) {
        // If chat instance does not exist, create new chat instance
        const instance: ChatInstance = {
          PK: `INSTANCE#${senderWallet}#${receiverWallet}`,
          SK: uuidv4(),
          myWallet: senderWallet,
          partnerWallet: receiverWallet,
          partnerType: partnerType,
          visible: true,
          lastMessageId: newMessage.PK,
        };

        await this.instanceModel.create(instance);
      } else {
        // If chat instance already exists, update the lastMessageId with the new message
        await this.instanceModel.update(
          { PK: chatInstances[0].PK, SK: chatInstances[0].SK },
          { lastMessageId: newMessage.SK }
        );
      }

      return newMessage;
    } catch (e) {
      console.log(e);
      throw new HttpException('An error occurred while sending a message: ' + e.message, 500);
    }
  }
}
