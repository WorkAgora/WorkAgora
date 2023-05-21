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
  firstname?: string;
  lastname?: string;
  description?: string;
  phone?: string;
  language?: string[];
  location?: string;
  profilePicture?: string;
  links?: string[];
  createdAt?: string;
  updatedAt?: string;
  freelanceProfile?: FreelancerProfile;
  employerProfile?: EmployerProfile;
  currentUserType?: string;
  tosAcceptedOn?: string;
}
