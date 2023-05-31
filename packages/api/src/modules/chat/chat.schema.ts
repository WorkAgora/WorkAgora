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
  myWallet: {
    type: String
  },
  partnerWallet: {
    type: String
  },
  partnerType: {
    type: String
  },
  visible: {
    type: Boolean
  },
  lastMessageId: {
    type: String
  },
  // Chat Message attributes
  receiverWallet: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: String
  }
});
