import { KycStatus, KycService, KycServiceState } from './kyc.enum';
import { Schema } from 'dynamoose';
import { walletRegex } from '../../../../utils/src/index';
import { ValueType } from 'dynamoose/dist/Schema';

export const KycSessionSchema = new Schema({
  userWallet: {
    type: String,
    required: true,
    hashKey: true,
    validate: walletRegex
  },
  sessionId: {
    type: String,
    required: true,
    rangeKey: true
  },
  // KycStatus
  status: {
    type: String,
    required: true,
    default: KycStatus.PENDING,
    validate(value: ValueType) {
      return Object.values(KycStatus).includes(value as KycStatus);
    }
  },
  // KycStepSchema[]
  steps: {
    type: Array,
    required: true,
    default: []
  }
});

export class KycStepSchema {
  userWallet: string;
  serviceName: KycService;
  state: KycServiceState;
  sessionId: string;
}
