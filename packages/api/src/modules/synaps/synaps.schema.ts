import { Schema } from 'dynamoose';

export const SynapsSessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    hashKey: true
  },
  alias: {
    type: String,
    required: false
  },
  sandbox: {
    type: Boolean,
    required: true
  }
});
