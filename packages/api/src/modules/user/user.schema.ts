import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  id: {
    hashKey: true,
    type: String,
    default: () => uuidv4()
  },
  wallet: {
    type: String,
    required: true,
    index: {
      type: 'global',
      name: 'walletIndex'
    }
  },
  email: {
    type: String,
    required: true,
    index: {
      type: 'global',
      name: 'emailIndex'
    }
  }
});
