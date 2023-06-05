import { CreateCompany } from "./company";
import { User } from "./user";

export interface ChatItemKey {
  PK: string;
  SK: string;
}

export interface ChatMessage extends ChatItemKey {
  senderWallet: string;
  receiverWallet: string;
  content: string;
  createdAt: string;
}

export enum ChatAuthorType {
  Company = 'Company',
  User = 'User'
}

export interface ChatInstance extends ChatItemKey {
  user1: string;
  user2: string;
  lastMessageId?: string;
  lastMessage?: ChatMessage;
  user1Type: ChatAuthorType;
  partnerUser?: User;
  partnerCompany?: CreateCompany;
  visible: boolean;
  jobRelated?: string;
}

export type ChatDocument = ChatMessage | ChatInstance;
