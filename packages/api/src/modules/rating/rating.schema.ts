import { Schema } from 'dynamoose';
import { walletRegex } from '../../../../utils/src/index';

export const RatingSchema = new Schema({
  walletReceiver: {
    type: String,
    required: true,
    hashKey: true,
    validate: walletRegex,
  },
  wallet: {
    type: String,
    required: true,
    rangeKey: true,
    validate: walletRegex,
  },
  stars: {
    type: Number,
    required: true,
    validate(value) {
      value = Number(value);
      if (isNaN(value)) {
        return false;
      }
      return value >= 1 && value <= 5;
    },
  },
  comment: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    index: {
      type: 'global',
      rangeKey: 'walletReceiver',
      name: 'TxHashIndex',
      project: true,
      throughput: 'ON_DEMAND',
    },
  },
});
