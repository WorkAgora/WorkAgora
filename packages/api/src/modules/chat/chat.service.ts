import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ChatMessage, ChatMessageKey, ChatConversation } from './chat.interface';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessageDTO } from '../../dtos/chat/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat')
    private readonly model: Model<ChatMessage, ChatMessageKey>
  ) {}

  async sendMessage(
    senderWallet: string,
    receiverWallet: string,
    content: string
  ): Promise<ChatMessageDTO> {
    try {
      const message: ChatMessage = {
        uuid: uuidv4(),
        senderWallet: senderWallet,
        receiverWallet: receiverWallet,
        content: content,
        createdAt: new Date().toISOString()
      };

      return await this.model.create(message);
    } catch (e) {
      throw new UnprocessableEntityException('Could not send message: ' + e.message);
    }
  }

  async getConversations(userWallet: string): Promise<ChatConversation[]> {
    try {
      const sentMessages = await this.model.scan({ senderWallet: userWallet }).exec();
      const receivedMessages = await this.model.scan({ receiverWallet: userWallet }).exec();

      const allMessages = [...sentMessages, ...receivedMessages];
      const partnerIds = [
        ...new Set(
          allMessages.map((message) =>
            message.receiverWallet === userWallet ? message.senderWallet : message.receiverWallet
          )
        )
      ];

      const conversations: ChatConversation[] = [];

      for (const partnerId of partnerIds) {
        const partnerMessages = allMessages.filter(
          (message) => message.senderWallet === partnerId || message.receiverWallet === partnerId
        );

        // Sort messages by timestamp
        partnerMessages.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        conversations.push({
          partnerWallet: partnerId,
          lastMessage: partnerMessages[0]
        });
      }

      return conversations;
    } catch (e) {
      throw new UnprocessableEntityException('Could not get conversations: ' + e.message);
    }
  }

  async getMessages(userWallet: string, partnerWallet: string): Promise<ChatMessage[]> {
    try {
      const sentMessages = await this.model
        .scan({ senderWallet: userWallet, receiverWallet: partnerWallet })
        .exec();
      const receivedMessages = await this.model
        .scan({ senderWallet: partnerWallet, receiverWallet: userWallet })
        .exec();

      const messages = [...sentMessages, ...receivedMessages];

      // Sort messages by timestamp
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return messages;
    } catch (e) {
      throw new UnprocessableEntityException('Could not get messages: ' + e.message);
    }
  }
}
