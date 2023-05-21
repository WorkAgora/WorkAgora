export interface JobKey {
  contractorWallet: string;  // PK
  GUID: string;  // SK
}

export interface CreateJob extends JobKey {
  employerWallet: string;
  contractPrice: number;
  contractDescription: string;
  contractTags: string[];
  contractDuration: string;
  contractStartExpiryDate: string;
}

export type JobCreationResponse = {
  JCC: CreateJob;
  contractorSignature: string;
  employerSignature: string;
};