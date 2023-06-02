import { Schema } from 'dynamoose';

export const NotificationSchema = new Schema({
  userWallet: {
    type: String,
    hashKey: true
  },
  id: String,
  title: String,
  message: String,
  read: Boolean,
  type: String,
  createdAt: {
    type: String,
    rangeKey: true
  }
});
