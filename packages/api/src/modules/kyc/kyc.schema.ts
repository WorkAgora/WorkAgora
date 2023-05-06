import { KycStatus, KycService, KycServiceState } from './kyc.enum';
import { Schema } from 'dynamoose';
import { walletRegex } from '../../../../utils/src/index';
import { ValueType } from 'dynamoose/dist/Schema';

export const KycSessionSchema = new Schema({
  wallet: {
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

export const KycStepSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    hashKey: true,
    validate: walletRegex
  },
  serviceName: {
    type: String,
    required: true,
    validate(value: ValueType) {
      return Object.values(KycService).includes(value as KycService);
    }
  },
  state: {
    type: String,
    required: true,
    default: KycServiceState.NOT_STARTED,
    validate(value: ValueType) {
      return Object.values(KycServiceState).includes(value as KycServiceState);
    }
  },
  sessionId: {
    type: String,
    required: true,
    rangeKey: true
  }
});
