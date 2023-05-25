import { Schema } from 'dynamoose';

export const ExperienceSchema = new Schema({
  role: String,
  company: String,
  description: String,
  startDate: String,
  endDate: String,
  imageUrl: String
}, { saveUnknown: true });
