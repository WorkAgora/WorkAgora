import { KycService, KycServiceState, KycStatus } from './kyc.enum';

export interface KycSession {
  userWallet: string;
  sessionId: string;
  status: KycStatus;
  steps: KycStep[];
}

export interface KycStep {
  userWallet: string;
  serviceName: KycService;
  state: KycServiceState;
  sessionId: string;
}
