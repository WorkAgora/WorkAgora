export interface ChatMessageKey {
  uuid: string;
}

export interface ChatMessage extends ChatMessageKey {
  senderWallet: string;
  receiverWallet: string;
  content: string;
  createdAt: string;
}

export interface ChatConversation {
  partnerWallet: string;
  lastMessage: ChatMessage;
}
