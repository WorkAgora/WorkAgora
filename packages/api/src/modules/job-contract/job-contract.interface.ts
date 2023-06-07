import {SignedMessage} from '../../../../utils/src/index';

export interface JobContractKey {
  PK: string;
  SK: string;
}

export interface UserSignature {
  signature?: string;
  cid: SignedMessage;
  wallet?: string;
}

export interface JobProposal extends JobContractKey {
  priceUsd: number;
  token: number; // used for payment
  initialDepositPct: number;
  lockedAmountPct: number;
  deferredAmountPct: number;
  description: string;
  tags: string[];
  durationInDay: number;
  creationExpiryTimestamp: string;
  freelancerWallet: string;
  companyWallet: string;
}

export interface JobMetadataIpfs {
  metadata: JobProposal;
  contractorSignature: string;
  employerSignature: string;
}

export enum JobContractStatus {
  None,
  Started,
  CompleteWithSuccess,
  OngoingDispute,
  CompleteWithDispute
}

export interface JobContract extends JobProposal {
  JobProposal?: JobProposal;
  freelancerValidated: boolean;
  freelancerSignature?: UserSignature;
  companySignature?: UserSignature;
  companyValidated: boolean;
  jobAdId?: string;
  createdAt: string;
  open: JobContractStatus;
  cid?: string;
}

// JEF
interface JobContractCompanyFinalization {
  contractId: string;
  fileSha512: string; // hash of contractor final submission file
  review: string; // employer review
}

// JCF
interface JobContractFreelancerFinalization {
  contractId: string;
  review: string; // contractor review
}

// Used for .finalize() method - Blockchain
export interface FinalizationParams {
    contractId: string;
    ipfsJfiHash: string;
}

export interface JobFile extends JobContractKey {
  fileHash: string;
  fileName: string;
  fileUuid: string;
}


export type JobContractDocument = JobContract | JobProposal | JobContractFreelancerFinalization | JobFile | JobContractCompanyFinalization;

/**
 * Get the DynamoDB key for a JobContract
 * @param uuid The Job UUID
 * @returns The DynamoDB key
 */
export function getJobContractKey(uuid: string): JobContractKey {
  // Remove the prefix if it exists
  if (uuid.includes('#')) {
    uuid = uuid.split('#')[1];
  }

  return {
    PK: "JobContract#" + uuid,
    SK: "#METADATA"
  };
}

export function getJobProposalKey(uuid: string): JobContractKey {
  // Remove the prefix if it exists
  if (uuid.includes('#')) {
    uuid = uuid.split('#')[1];
  }

  return {
    PK: "JobProposal#" + uuid,
    SK: "#METADATA"
  };
}

export function getJobFileKey(uuid: string): JobContractKey {
  // Remove the prefix if it exists
  if (uuid.includes('#')) {
    uuid = uuid.split('#')[1];
  }

  return {
    PK: "JobFile#" + uuid,
    SK: "#METADATA"
  };
}
