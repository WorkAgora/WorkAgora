export interface UserKey {
  wallet: string;
}

export interface WorkerProfile {
  skills?: string[];
  situation?: string;
  availability?: string;
  hoursPerWeek?: number;
  yearsOfExperience?: string;
  certificates?: string[];
  remuneration?: string;
}

export interface ClientProfile {
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
  workProfile?: WorkerProfile;
  clientProfile?: ClientProfile;
}
