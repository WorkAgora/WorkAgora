import { KycStatus, KycService, KycServiceState } from './kyc.enum';

export class KycSession {
  sessionId: string; // SK
  userWallet: string; // PK
  status: KycStatus;
  steps: KycStep[];
}

export class KycStep {
  id: string;
  service: KycService;
  state: KycServiceState;
  kycId: string;
  kycSession: KycSession;
  rejectionReason: string | null;
}
