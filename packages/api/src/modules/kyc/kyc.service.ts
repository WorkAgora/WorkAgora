import { Injectable } from '@nestjs/common';
import { KycStepSchema } from './kyc.schema';
import { KycService as KycServiceEnum, KycServiceState } from './kyc.enum';
import { v4 as uuidv4 } from 'uuid';
import { KycStatus } from './kyc.enum';
import { KycSession } from './kyc.interface';

@Injectable()
export class KycService {
  private kycSessions: KycSession[] = [];
  private kycSteps: KycStepSchema[] = [];

  createOrGetSession(userWallet: string): Promise<KycSession> {
    const existingSession = this.kycSessions.find((session) => session.userWallet === userWallet);

    if (existingSession) {
      return Promise.resolve(existingSession);
    }

    const sessionId = uuidv4();
    const newSession: KycSession = {
      sessionId: sessionId,
      userWallet: userWallet,
      status: KycStatus.PENDING,
      steps: [
        { sessionId, userWallet, serviceName: KycServiceEnum.LIVENESS, state: KycServiceState.NOT_STARTED },
        { sessionId, userWallet, serviceName: KycServiceEnum.IDENTITY, state: KycServiceState.NOT_STARTED },
        { sessionId, userWallet, serviceName: KycServiceEnum.RESIDENCY, state: KycServiceState.NOT_STARTED }
      ]
    };

    this.kycSessions.push(newSession);
    this.kycSteps.push(...newSession.steps);

    return Promise.resolve(newSession);
  }

  findStepBySessionIdAndService(
    sessionId: string,
    service: KycServiceEnum
  ): Promise<KycStepSchema | null> {
    const step = this.kycSteps.find(
      (kycStep) => kycStep.sessionId === sessionId && kycStep.serviceName === service
    );

    return Promise.resolve(step || null);
  }

  updateStepById(
    sessionId: string,
    service: KycServiceEnum,
    data: { state: KycServiceState; rejectionReason?: string }
  ): Promise<void> {
    const stepIndex = this.kycSteps.findIndex(
      (kycStep) => kycStep.sessionId === sessionId && kycStep.serviceName === service
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
