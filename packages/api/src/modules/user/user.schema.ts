import { emailRegex, locationRegex, phoneRegex, urlRegex, walletRegex } from '@workaurora/utils';
import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    hashKey: true,
    validate: walletRegex
  },
  email: {
    type: String,
    required: true,
    rangeKey: true,
    validate: emailRegex
  },
  description: {
    type: String,
    required: false,
    validate(value) {
      return value.toString().length <= 500;
    }
  },
  phone: {
    type: String,
    required: false,
    validate(value) {
      if (!value) return true;
      const match = value.toString().match(phoneRegex);
      return match !== null && match.length > 0;
    }
  },
  language: {
    type: Array,
    required: false
  },
  skills: {
    type: Array,
    required: false
  },
  situation: {
    type: String,
    required: false
  },
  availability: {
    type: String,
    required: false
  },
  hoursPerWeek: {
    type: Number,
    required: false
  },
  location: {
    type: String,
    required: false,
    validate(value) {
      if (!value) return true;
      const match = value.toString().match(locationRegex);
      return match !== null && match.length > 0;
    }
  },
  remuneration: {
    type: String,
    required: false
  },
  links: {
    type: Array,
    required: false
  },
  yearsOfExperience: {
    type: String,
    required: false
  },
  fullName: {
    type: String,
    required: false
  },
  certification: {
    type: Array,
    required: false
  },
  profilePicture: {
    type: String,
    required: false,
    validate(value) {
      if (!value) return true;
      const match = value.toString().match(urlRegex);
      return match !== null && match.length > 0;
    }
  },
  createdAt: {
    type: Date,
    required: false
  },
  updatedAt: {
    type: Date,
    required: false
  }
});
