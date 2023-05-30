import { CreateCompany } from './company';

export interface ConfirmJobKey {
  contractorWallet: string; // PK
  GUID: string; // SK
}

export interface ConfirmJob extends ConfirmJobKey {
  employerWallet: string;
  contractPrice: number;
  contractDescription: string;
  contractTags: string[];
  contractDuration: string;
  contractStartExpiryDate: string;
}

export type JobCreationResponse = {
  JCC: ConfirmJob;
  contractorSignature: string;
  employerSignature: string;
};

export enum WorkAvailability {
  FullTime = 'Full-time',
  PartTime = 'Part-time',
  Contract = 'Contract',
  Internship = 'Internship'
}

export enum Visibility {
  Public = 'Public',
  Private = 'Private'
}

export interface WorkDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
}

export interface JobKey {
  uuid: string; // PK
  contractorWallet: string; // SK
}

export interface CreateJob extends JobKey {
  title: string;
  location: string;
  availability: WorkAvailability;
  duration: WorkDuration;
  jobMission: string;
  responsibilities: string;
  requirements: string;
  tags: string[];
  visibility: Visibility;
  createdAt: string;
  companyUuid: string;
  company?: CreateCompany;
}

export const workLocationOptions: { [key: string]: string } = {
  fullRemote: 'Full-remote',
  partialRemote: 'Partial-remote',
  onSite: 'On site'
};

export const availabilityOptions: { [key: string]: string } = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  contract: 'Contract',
  internship: 'Internship'
};
