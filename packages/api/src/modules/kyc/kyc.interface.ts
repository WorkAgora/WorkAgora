import { KycService, KycServiceState, KycStatus } from './kyc.enum';

export interface KycSession {
  wallet: string;
  sessionId: string;
  status: KycStatus;
  steps: KycStep[];
}

export interface KycStep {
  wallet: string;
  serviceName: KycService;
  state: KycServiceState;
  sessionId: string;
}
