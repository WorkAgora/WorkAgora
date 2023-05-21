import {KycService, KycServiceState, KycStatus} from './kyc.enum';
import {Schema} from 'dynamoose';
import {walletRegex} from '../../../../utils/src/index';
import {ValueType} from 'dynamoose/dist/Schema';

export const KycSessionSchema = new Schema({
  wallet: {
    type: String, required: true, rangeKey: true, validate: walletRegex
  }, sessionId: {
    type: String, required: true, hashKey: true,
  }, // KycStatus
  status: {
    type: String,
    enum: Object.values(KycStatus),
    required: true,
    default: KycStatus.PENDING,
    validate(value: ValueType) {
      return Object.values(KycStatus).includes(value as KycStatus);
    }
  }, // KycStepSchema[]
  steps: {
    type: Array, schema: [{
      type: Object, schema: {
        serviceName: {
          type: String, required: true, validate(value: ValueType) {
            return Object.values(KycService).includes(value as KycService);
          }
        }, state: {
          type: String, required: true, default: KycServiceState.NOT_STARTED, validate(value: ValueType) {
            return Object.values(KycServiceState).includes(value as KycServiceState);
          }
        }, rejectionReason: {type: String, required: false}
      }
    }], required: true,
  }
});
