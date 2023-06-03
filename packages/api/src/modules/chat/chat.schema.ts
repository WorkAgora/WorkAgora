import { Schema } from 'dynamoose';
import { IndexType } from 'dynamoose/dist/Schema';

export const ChatSchema = new Schema({
  PK: {
    type: String, // ChatInstance uuid or ChatMessage senderWallet
    hashKey: true,
    index: {
      name: 'PKIndex',
      type: IndexType.global,
      rangeKey: 'SK',
      project: true
    }
  },
  SK: {
    type: String, // 'INSTANCE#' + uuid or 'MESSAGE#' + uuid
    rangeKey: true
  },
  // Chat Instance attributes
  user1: {
    type: String
  },
  user2: {
    type: String
  },
  user1Type: {
    type: String
  },
  visible: {
    type: Boolean
  },
  lastMessageId: {
    type: String
  },
  jobRelated: {
    type: String
  },
  // Chat Message attributes
  receiverWallet: {
    type: String
  },
  senderWallet: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: String
  }
});
