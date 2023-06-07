import { Schema } from 'dynamoose';
import { JobContractStatus } from './job-contract.interface';

export const JobContractSchema = new Schema(
  {
    PK: {
      type: String,
      hashKey: true
    },
    SK: {
      type: String,
      rangeKey: true
    },
    priceUsd: Number,
    token: Number,
    initialDepositPct: Number,
    lockedAmountPct: Number,
    deferredAmountPct: Number,
    description: String,
    tags: {
      type: Array,
      schema: [String]
    },
    durationInDay: Number,
    creationExpiryTimestamp: String,
    freelancerWallet: String,
    companyWallet: String,
    employerWallet: String,
    contractorWallet: String,
    JobProposal: {
      type: Object
    },
    freelancerValidated: Boolean,
    freelancerSignature: {
      type: Object,
      required: false
    },
    companyValidated: Boolean,
    jobAdId: String,
    createdAt: String,
    open: {
      type: Number,
      enum: Object.values(JobContractStatus),
      required: false,
      index: {
        name: 'openIndex',
        project: true,
        type: 'global',
        rangeKey: 'SK'
      }
    },
    fileHash: String,
    fileName: String,
    review: String,
    jobContractUuid: {
      type: String,
      required: false
    }
  },
  {saveUnknown: true}
);
