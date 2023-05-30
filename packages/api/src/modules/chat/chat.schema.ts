// chat-message.schema.ts
import { Schema } from 'dynamoose';

export const ChatMessageSchema = new Schema({
  uuid: {
    type: String,
    hashKey: true
  },
  senderWallet: {
    type: String,
    required: true
  },
  receiverWallet: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
});
