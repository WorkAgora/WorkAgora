import { Schema } from 'dynamoose';

export const CompanySchema = new Schema({
  uuid: {
    type: String,
    required: true,
    hashKey: true
  },
  companyWallet: {
    type: String,
    required: true,
    rangeKey: true
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  logoUrl: {
    type: String,
    required: false
  },
  websiteUrl: {
    type: String,
    required: false
  },
  createdAt: {
    type: String,
    required: true
  }
});
