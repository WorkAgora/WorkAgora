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
  nonceTimeout: {
    type: Date,
    default: Date.now() + 'interval 30min'
  },
  wallet: {
    type: String,
    required: true,
    index: {
      type: 'global',
      name: 'walletIndex'
    }
  }
});
