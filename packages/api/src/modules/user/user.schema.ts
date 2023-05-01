import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    hashKey: true
  },
  email: {
    type: String,
    required: true,
    rangeKey: true
  }
});
