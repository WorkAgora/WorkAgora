import { KycService, KycServiceState, KycStatus } from './kyc.enum';

export interface KycSessionKey {
  sessionId: string; // PK
}

export interface KycSession extends KycSessionKey {
  wallet: string; // SK
  status: KycStatus;
  steps: KycStep[];
}

export interface KycStep {
  serviceName: KycService;
  state: KycServiceState;
  rejectionReason?: string;
}

export interface KycWebhookPayload {
  reason?: string;
  service: KycService;
  session_id: string;
  state: KycServiceState;
  step_id: string;
}
