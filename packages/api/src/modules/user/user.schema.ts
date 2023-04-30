import { Schema } from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const UserSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4
  },
  wallet: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});
