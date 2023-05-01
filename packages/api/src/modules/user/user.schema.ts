import { Schema } from 'dynamoose';

// Regex to validate a phone number (including European phone numbers)
const phoneRegex = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;

// Regex to validate a location (allowing only the name of the city, country, or land)
const locationRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

// Regex to validate an email address
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

// Regex to validate a URL
const urlRegex = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

export const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    hashKey: true,
    validate: (v: string) => v.length === 42 && v.startsWith('0x'),
  },
  email: {
    type: String,
    required: true,
    rangeKey: true,
    validate: (v: string) => v.match(emailRegex).length > 0,
  },
  description: {
    type: String,
    required: false,
    validate: (v: string) => v.length <= 500,
  },
  phone: {
    type: String,
    required: false,
    validate: (v: string) => v.match(phoneRegex).length > 0,
  },
  language: {
    type: Array,
    required: false,
  },
  skills: {
    type: Array,
    required: false,
  },
  situation: {
    type: String,
    required: false,
  },
  availability: {
    type: String,
    required: false,
  },
  hoursPerWeek: {
    type: Number,
    required: false,
  },
  location: {
    type: String,
    required: false,
    validate: (v: string) => v.match(locationRegex).length > 0,
  },
  remuneration: {
    type: String,
    required: false,
  },
  links: {
    type: Array,
    required: false,
  },
  yearsOfExperience: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
  certification: {
    type: Array,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
    validate: (v: string) => v.match(urlRegex).length > 0,
  },
});
