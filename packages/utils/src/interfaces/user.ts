export interface UserKey {
  wallet: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
}

export interface FreelancerProfile {
  skills?: string[];
  longDesc?: string;
  situation?: string;
  workLocation?: string;
  availability?: string;
  hoursPerWeek?: number;
  yearsOfExperience?: string;
  certificates?: string[];
  remuneration?: string;
  experiences?: Experience[];
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
  hasFreelanceProfile?: string;
  freelanceProfile?: FreelancerProfile;
  employerProfile?: EmployerProfile;
  currentUserType?: string;
  tosAcceptedOn?: string;
}
