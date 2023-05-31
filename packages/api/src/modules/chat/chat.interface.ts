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
  Contractor = 'contractor',
  Freelancer = 'freelancer'
}

export interface ChatInstance extends ChatItemKey {
  myWallet: string;
  partnerWallet: string;
  lastMessageId: string;
  lastMessage?: ChatMessage;
  partnerType: ChatAuthorType;
  visible: boolean;
}

export type ChatDocument = ChatMessage | ChatInstance;
