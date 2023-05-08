import { KycService, KycServiceState, KycStatus } from './kyc.enum';

export interface KycSessionKey {
  wallet: string;
}

export interface KycSession extends KycSessionKey {
  sessionId: string;
  status: KycStatus;
  steps: KycStep[];
  alias: string;
  sandbox: boolean;
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
