import { Schema } from 'dynamoose';

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
