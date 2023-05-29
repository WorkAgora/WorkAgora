import { Schema } from 'dynamoose';

export const JobSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    hashKey: true
  },
  contractorWallet: {
    type: String,
    required: true,
    rangeKey: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  duration: {
    type: Object,
    schema: {
      years: {
        type: Number,
        required: true
      },
      months: {
        type: Number,
        required: true
      },
      days: {
        type: Number,
        required: true
      },
      hours: {
        type: Number,
        required: true
      }
    }
  },
  jobMission: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: false
  },
  createdAt: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    required: true,
    index: {
      name: 'visibilityIndex',
      rangeKey: 'createdAt',
      throughput: 'ON_DEMAND',
      project: true // ProjectionType: ALL
    }
  },
  companyUuid: {
    type: String,
    required: true,
    index: {
      name: 'companyUuidIndex',
      rangeKey: 'createdAt',
      throughput: 'ON_DEMAND',
      project: true // ProjectionType: ALL
    }
  }
});

export const JobContractSchema = new Schema({
  GUID: String,
  employerWallet: String,
  contractorWallet: String,
  contractPrice: Number,
  contractDescription: String,
  contractTags: Array,
  contractDuration: String,
  contractStartExpiryDate: String,
  JM_IPFS_hash: String,
  contractorSignature: String,
  employerSignature: String
});
