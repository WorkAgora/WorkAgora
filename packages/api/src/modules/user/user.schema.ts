import {
  emailRegex,
  locationRegex,
  phoneRegex,
  urlRegex,
  walletRegex
} from '../../../../utils/src/index';
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
  language: {
    type: Array,
    schema: [String],
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
  profilePicture: {
    type: String,
    required: false,
    validate(value) {
      if (!value) return true;
      const match = value.toString().match(urlRegex);
      return match !== null && match.length > 0;
    }
  },
  links: {
    type: Array,
    schema: [String],
    required: false
  },
  createdAt: {
    type: String,
    index: {
      type: "global",
      name: 'FreelancerCreationIndex', // Name of the GSI
      rangeKey: 'currentUserType', // The sort key of the GSI
      project: true, // This will project all fields in the GSI
    },
  },
    updatedAt: String,
  tosAcceptedOn: String,
  currentUserType: String,
  freelanceProfile: {
    type: Object,
    schema: {
      skills: {
        type: Array,
        schema: [String],
        required: false
      },
      situation: String,
      availability: String,
      hoursPerWeek: Number,
      yearsOfExperience: String,
      certificates: {
        type: Array,
        schema: [String],
        required: false
      },
      remuneration: String
    }
  },
  employerProfile: {
    type: Object,
    schema: {
      companyId: String
    }
  }
});
