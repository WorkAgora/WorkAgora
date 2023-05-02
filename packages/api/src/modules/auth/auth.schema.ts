import { walletRegex } from '@workaurora/utils';
import { Schema } from 'dynamoose';

export const AuthSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    hashKey: true,
    validate: walletRegex
  },
  nonce: {
    type: String
  },
  nonceTimeout: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
  }
});
