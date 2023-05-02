import {
  emailRegex,
  locationRegex,
  phoneRegex,
  urlRegex,
  walletRegex
} from '../../../../utils/src/index';
import { Schema } from 'dynamoose';

//@TODO add Schema for FreelancerProfile / EmployerProfile
// Also fix this schema looking at user.interface.ts

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
  firstname: String,
  lastname: String,
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
  language: Array,
  skills: Array,
  situation: String,
  availability: String,
  hoursPerWeek: Number,
  location: {
    type: String,
    required: false,
    validate(value) {
      if (!value) return true;
      const match = value.toString().match(locationRegex);
      return match !== null && match.length > 0;
    }
  },
  remuneration: String,
  links: Array,
  yearsOfExperience: String,
  certification: Array,
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
