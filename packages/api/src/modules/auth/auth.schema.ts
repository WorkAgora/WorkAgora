import { Schema } from 'dynamoose';

export const AuthSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    hashKey: true
  },
  nonce: {
    type: String
  },
  nonceTimeout: {
    type: Date,
    default: Date.now() + 'interval 5min'
  }
});
