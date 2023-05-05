import { Injectable } from '@nestjs/common';
import { KycSession, KycStep } from './kyc.schema';
import { KycService as KycServiceEnum, KycServiceState } from './kyc.enum';
import { v4 as uuidv4 } from 'uuid';
import { KycStatus } from './kyc.enum';

@Injectable()
export class KycService {
  private kycSessions: KycSession[] = [];
  private kycSteps: KycStep[] = [];

  createOrGetSession(userId: string): Promise<KycSession> {
    const existingSession = this.kycSessions.find((session) => session.userWallet === userId);

    if (existingSession) {
      return Promise.resolve(existingSession);
    }

    const sessionId = uuidv4();
    const newSession: KycSession = {
      sessionId: sessionId,
      userWallet: userId,
      session: sessionId,
      status: KycStatus.PENDING,
      steps: [
        { id: uuidv4(), service: KycServiceEnum.LIVENESS, state: KycServiceState.NOT_STARTED },
        { id: uuidv4(), service: KycServiceEnum.IDENTITY, state: KycServiceState.NOT_STARTED },
        { id: uuidv4(), service: KycServiceEnum.RESIDENCY, state: KycServiceState.NOT_STARTED }
      ]
    };

    this.kycSessions.push(newSession);
    this.kycSteps.push(...newSession.steps);

    return Promise.resolve(newSession);
  }

  findStepBySessionIdAndService(
    sessionId: string,
    service: KycServiceEnum
  ): Promise<KycStep | null> {
    const step = this.kycSteps.find(
      (kycStep) => kycStep.id === sessionId && kycStep.service === service
    );

    return Promise.resolve(step || null);
  }

  updateStepById(
    sessionId: string,
    service: KycServiceEnum,
    data: { state: KycServiceState; rejectionReason?: string }
  ): Promise<void> {
    const stepIndex = this.kycSteps.findIndex(
      (kycStep) => kycStep.kycSessionId === sessionId && kycStep.service === service
    );

    if (stepIndex !== -1) {
      this.kycSteps[stepIndex] = { ...this.kycSteps[stepIndex], ...data };
    }

    return Promise.resolve();
  }

  checkForFinalValidation(sessionId: string): Promise<void> {
    // TODO update the session status based on the steps' states
    return Promise.resolve();
  }
}
