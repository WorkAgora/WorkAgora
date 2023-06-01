import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { ChatDocument, ChatInstance, ChatItemKey, ChatMessage } from '../../../../utils/src/index';
import { CreateChatMessageDTO } from '../../dtos/chat/create-chat.dto';
import { ToggleVisibilityDto } from '../../dtos/chat/toggle-visibility.dto';
import { GetMessagesDto } from '../../dtos/chat/get-messages.dto';
import { UserService } from '../user/user.service';
import { UpdateJobRelatedDTO } from '../../dtos/chat/update-jobRelated';
import { UserDTO } from '../../dtos/user/user.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat')
    private readonly model: Model<ChatDocument, ChatItemKey>,
    private readonly userService: UserService,
    private readonly companyService: CompanyService
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
        createdAt: createdAt
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
          { lastMessageId: newMessage.PK, lastMessage: newMessage }
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
      const conversations = await this.model.scan('PK').beginsWith(`INSTANCE#${wallet}`).exec();

      // Fetch the last message for each conversation
      const updatedConversations = await Promise.all(
        conversations.map(async (item) => {
          const doc = item.toJSON() as ChatDocument; // Convert item to ChatDocument
          if (!doc.PK.startsWith('INSTANCE#')) {
            // If doc is not a ChatInstance, return it as is
            return doc;
          }

          const instance = doc as ChatInstance; // Now we know doc is a ChatInstance, we can cast it

          const message = await this.model.query('PK').eq(instance.lastMessageId).exec();

          const lastMessage = message[0];

          const partnerUser: UserDTO = await this.userService.findUserByWallet(
            instance.partnerWallet
          );

          const partnerCompany = await this.companyService.getMyCompanies(instance.partnerWallet);

          return {
            ...instance,
            lastMessage: lastMessage,
            partnerUser: partnerUser ? partnerUser : null,
            partnerCompany: partnerCompany.length === 1 ? partnerCompany[0] : null
          };
        })
      );

      // Sort conversations by lastMessage.createdAt
      updatedConversations.sort((a: any, b: any) => {
        if ('lastMessage' in a && 'lastMessage' in b) {
          return (
            new Date(b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.createdAt).getTime()
          );
        } else {
          return 0;
        }
      });

      return updatedConversations;
    } catch (e) {
      console.log(e);
      throw new HttpException('An error occurred while fetching conversations: ' + e.message, 500);
    }
  }

  async toggleVisibility(currentWallet: string, instance: ToggleVisibilityDto): Promise<boolean> {
    try {
      // Query for chat instance
      const [queryOneResult, queryTwoResult] = await Promise.all([
        this.model.query('PK').eq(`INSTANCE#${currentWallet}#${instance.partnerWallet}`).exec(),
        this.model.query('PK').eq(`INSTANCE#${instance.partnerWallet}#${currentWallet}`).exec()
      ]);

      // Combine the results
      const combinedResults = [...queryOneResult, ...queryTwoResult];

      if (combinedResults.length === 0) {
        throw new HttpException('Chat instance not found', 404);
      }

      const chatInstance = combinedResults[0].toJSON() as ChatInstance;

      // Toggle visibility
      chatInstance.visible = !chatInstance.visible;

      // Update the instance
      await this.model.update(
        { PK: chatInstance.PK, SK: chatInstance.SK },
        { visible: chatInstance.visible }
      );

      return chatInstance.visible;
    } catch (e) {
      console.log(e);
      throw new HttpException('An error occurred while toggling visibility: ' + e.message, 500);
    }
  }

  async getMessages(
    wallet: string,
    instance: GetMessagesDto
  ): Promise<{ messages: ChatMessage[]; maxPage: number; totalResult: number }> {
    try {
      const instanceId = instance.instanceId.startsWith('INSTANCE#')
        ? instance.instanceId.split('#')[2]
        : instance.instanceId;

      const messages = await this.model
        .scan({
          PK: { beginsWith: 'MESSAGE#' },
          SK: { beginsWith: instanceId }
        })
        .exec();

      if (messages.length === 0) {
        throw new HttpException('Chat instance not found', 404);
      }

      const formattedMessages = messages.map((messageDoc) => messageDoc.toJSON() as ChatMessage);

      // Sort messages by createdAt
      formattedMessages.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      const maxPage = Math.ceil(messages.length / instance.limit);
      const startIndex = (instance.page - 1) * instance.limit;
      const endIndex = instance.page * instance.limit;

      return {
        messages: formattedMessages.slice(startIndex, endIndex),
        maxPage: maxPage,
        totalResult: messages.length
      };
    } catch (e) {
      console.log(e);
      throw new HttpException('An error occurred while fetching messages: ' + e.message, 500);
    }
  }

  async updateJobRelated(wallet: string, dto: UpdateJobRelatedDTO): Promise<ChatInstance> {
    try {
      // Query for chat instance
      const [queryOneResult, queryTwoResult] = await Promise.all([
        this.model.query('PK').eq(`INSTANCE#${wallet}#${dto.partnerWallet}`).exec(),
        this.model.query('PK').eq(`INSTANCE#${dto.partnerWallet}#${wallet}`).exec()
      ]);

      // Combine the results
      const combinedResults = [...queryOneResult, ...queryTwoResult];

      if (combinedResults.length === 0) {
        throw new HttpException('Chat instance not found', 404);
      }

      const chatInstance = combinedResults[0].toJSON() as ChatInstance;

      // Update the jobRelated field
      chatInstance.jobRelated = dto.jobRelated;

      // Update the instance
      await this.model.update(
        { PK: chatInstance.PK, SK: chatInstance.SK },
        { jobRelated: chatInstance.jobRelated }
      );

      return chatInstance;
    } catch (e) {
      console.log(e);
      throw new HttpException('An error occurred while updating job related: ' + e.message, 500);
    }
  }
}
