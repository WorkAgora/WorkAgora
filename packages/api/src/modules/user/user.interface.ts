export interface UserKey {
  wallet: string;
}

export interface User extends UserKey {
  email: string;
  description?: string;
  phone?: string;
  language?: string[];
  skills?: string[];
  situation?: string;
  availability?: string;
  hoursPerWeek?: number;
  location?: string;
  remuneration?: string;
  yearsOfExperience?: string;
  certificates?: string[];
  profilePicture?: string;
  links?: string[];
  createdAt?: Date;
}
