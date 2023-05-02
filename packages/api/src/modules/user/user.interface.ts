export interface UserKey {
  wallet: string;
}

export interface FreelancerProfile {
  skills?: string[];
  situation?: string;
  availability?: string;
  hoursPerWeek?: number;
  yearsOfExperience?: string;
  certificates?: string[];
  remuneration?: string;
}

export interface EmployerProfile {
  companyId?: string;
}

export interface User extends UserKey {
  email: string;
  description?: string;
  phone?: string;
  language?: string[];
  location?: string;
  profilePicture?: string;
  links?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  workProfile?: FreelancerProfile;
  clientProfile?: EmployerProfile;
}
