import { Schema } from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const AuthSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4
  },
  nonce: {
    type: String
  },
  nonceTimeOut: {
    type: Date,
    default: Date.now() + 'interval 30min'
  },
  userId: {
    type: String,
    rangeKey: true,
    required: true
  }
});
