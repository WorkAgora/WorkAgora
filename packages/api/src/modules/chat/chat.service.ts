import { Injectable, HttpException } from '@nestjs/common';
import {InjectModel, Model} from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import {ChatDocument, ChatInstance, ChatItemKey, ChatMessage} from './chat.interface';
import { CreateChatMessageDTO } from '../../dtos/chat/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat')
    private readonly model: Model<ChatDocument, ChatItemKey>,
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
      await this.model.create(newMessage);

      // Query for chat instances where myWallet equals senderWallet and partnerWallet equals receiverWallet
      const chatInstance1 = await this.model
        .query('PK')
        .eq(`INSTANCE#${senderWallet}#${receiverWallet}`)
        .exec();

      // Query for chat instances where myWallet equals receiverWallet and partnerWallet equals senderWallet
      const chatInstance2 = await this.model
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
          lastMessage: newMessage
        };

        await this.model.create(instance);
      } else {
        // If chat instance already exists, update the lastMessageId with the new message
        await this.model.update(
          { PK: chatInstances[0].PK, SK: chatInstances[0].SK },
          { lastMessageId: newMessage.SK, lastMessage: newMessage }
        );
      }

      return newMessage;
    } catch (e) {
      console.log(e);
      throw new HttpException('An error occurred while sending a message: ' + e.message, 500);
    }
  }

  async getConversations(wallet: string) {
    try {
      console.log("WalletInput:", wallet);
      const conversations = await this.model
        .scan('PK')
        .beginsWith(`INSTANCE#${wallet}`)
        .exec();

      // Fetch the last message for each conversation
      const updatedConversations = await Promise.all(
        conversations.map(async (item) => {
          const doc = item.toJSON() as ChatDocument; // Convert item to ChatDocument
          if (!doc.PK.startsWith('INSTANCE#')) {
            // If doc is not a ChatInstance, return it as is
            console.log("ChatInstance", JSON.stringify(doc));
            return doc;
          }

          const instance = doc as ChatInstance; // Now we know doc is a ChatInstance, we can cast it
          const lastMessage = await this.model
            .get({
              PK: `MESSAGE#${instance.lastMessageId}`,
              SK: `${instance.myWallet}#${instance.partnerWallet}`,
            });

          return {
            ...instance,
            lastMessage: lastMessage ? (lastMessage.toJSON() as ChatMessage) : undefined,
          };
        })
      );

      return conversations;
    } catch (e) {
      console.log(e);
      throw new HttpException('An error occurred while fetching conversations: ' + e.message, 500);
    }
  }
}

