import { HttpException, Injectable } from '@nestjs/common';
import { KycService as KycServiceEnum, KycServiceState, KycStatus } from './kyc.enum';
import { KycSession, KycSessionKey, KycWebhookPayload } from './kyc.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { KycSessionDTO } from '../../dtos/kyc/kyc-session.dto';
import { omit } from 'lodash';
import { KycStepDTO } from '../../dtos/kyc/kyc-step.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectModel('KycSession')
    private readonly model: Model<KycSession, KycSessionKey>,
    private httpService: HttpService
  ) {}

  /**
   * Initiate a KYC session.
   * @param wallet
   * @param alias
   * @return {Promise<KycSession>}
   */
  async initSynapsSession(wallet: string, alias: string): Promise<KycSession> {
    console.log('URL: ' + `${process.env.SYNAPS_API_BASE_URL}/session/init`);
    const response = await this.httpService
      .post(
        `${process.env.SYNAPS_API_BASE_URL}/session/init`,
        { alias },
        {
          headers: {
            'Client-Id': process.env.SYNAPS_CLIENT_ID,
            'Api-Key': process.env.SYNAPS_API_KEY
          }
        }
      )
      .toPromise();

    return {
      sessionId: response.data.session_id,
      status: KycStatus.PENDING,
      sandbox: response.data.sandbox,
      steps: [
        {
          serviceName: KycServiceEnum.IDENTITY,
          state: KycServiceState.NOT_STARTED
        },
        {
          serviceName: KycServiceEnum.LIVENESS,
          state: KycServiceState.NOT_STARTED
        },
        {
          serviceName: KycServiceEnum.RESIDENCY,
          state: KycServiceState.NOT_STARTED
        }
      ],
      alias,
      wallet
    };
  }

  /**
   * Get the Synaps session info.
   * @param sessionId
   * @return {Promise<AxiosResponse>} A promise that resolves to the session info.
   */
  async getSessionInfo(sessionId: string): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${process.env.SYNAPS_API_BASE_URL}/session/info`, {
        headers: {
          'Client-Id': process.env.SYNAPS_CLIENT_ID,
          'Api-Key': process.env.SYNAPS_API_KEY,
          'Session-Id': sessionId
        }
      })
      .toPromise();
  }

  /**
   * Lists all KYC sessions for a given wallet address (alias).
   * @param alias
   * @return {Promise<AxiosResponse>} A promise that resolves to the list of KYC sessions.
   */
  async listSessionsWithAlias(alias: string): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${process.env.SYNAPS_API_BASE_URL}/session/alias`, {
        headers: { 'Api-Key': process.env.SYNAPS_API_KEY },
        params: { alias }
      })
      .toPromise();
  }

  /**
   * Initiates a new KYC process for a given wallet address or returns the existing one.
   * @param {string} wallet The user's wallet address.
   * @return {Promise<KycSession>} A promise that resolves to the new or existing KYC session.
   */
  async initiateKycProcess(wallet: string): Promise<KycSessionDTO> {
    // If there is an existing session, return it
    try {
      const existingSession = await this.model.query('wallet').eq(wallet).exec();
      if (existingSession.count > 0) {
        return {
          ...omit(existingSession[0], ['alias', 'sandbox'])
        };
      }
    } catch (e) {
      if (e.message != "Index can't be found for query.") {
        throw e;
      }
    }

    // Otherwise, create a new session
    const newSession = await this.initSynapsSession(wallet, wallet);
    await this.model.create(newSession);
    return {
      ...omit(newSession, ['alias', 'sandbox'])
    };
  }

  /**
   * Checks the status of a KYC session by its ID.
   * @param {string} wallet The user's wallet address.
   * @return {Promise<KycSession>} A promise that resolves KYC Session
   */
  async checkSessionStatus(wallet: string): Promise<KycSessionDTO> {
    try {
      const session = await this.model.query('wallet').eq(wallet).exec();
      if (!session[0]) {
        throw new HttpException(`KYC-Session not found for ${wallet}`, 403);
      }
      return {
        ...omit(session[0], ['alias', 'sandbox'])
      };
    } catch (e) {
      throw new HttpException(
        `Error checking KYC-Session status for ${wallet}: ${e.message}`,
        e.status ? e.status : 500
      );
    }
  }
  async findStepBySessionIdAndService(sessionId: string, service: string): Promise<KycStepDTO> {
    const session = await this.model.query('sessionId').eq(sessionId).exec();
    if (session.count === 0) {
      throw new HttpException(`KYC-Session not found for ${sessionId}`, 500);
    }
    return session[0].steps.find((step) => step.serviceName === service);
  }

  /**
   * Updates the status of a KYC session by its ID.
   * @param {string} sessionId The ID of the KYC session.
   * @param {string} service The new status of the KYC session.
   * @param {KycWebhookPayload} updateData The new status of the KYC session.
   * @return {Promise<void>} A promise that resolves when the status has been updated.
   */
  async updateStepById(
    sessionId: string,
    service: string,
    updateData: KycWebhookPayload
  ): Promise<void> {
    try {
      const session = await this.model.query('sessionId').eq(sessionId).exec();

      if (session.count === 0) {
        throw new HttpException(`KYC-Session not found for ${sessionId}`, 500);
      }

      const sessionItem = session[0];
      const stepIndex = sessionItem.steps.findIndex((step) => step.serviceName === service);

      if (stepIndex !== -1) {
        sessionItem.steps[stepIndex] = {
          ...sessionItem.steps[stepIndex],
          ...updateData
        };
        await this.model.update(sessionItem);
      } else {
        throw new HttpException(`KYC-Step not found for ${service}`, 500);
      }
    } catch (e) {
      if (e.message != "Index can't be found for query.") throw e;
    }
  }

  /**
   * Checks if all KYC steps have been validated.
   * @param sessionId
   * @returns {Promise<boolean>}
   */
  async checkForFinalValidation(sessionId: string): Promise<boolean> {
    try {
      const session = await this.model.query('sessionId').eq(sessionId).exec();

      const isAllValidated = session[0].steps.every(
        (step) => step.state === KycServiceState.VALIDATED
      );

      if (isAllValidated) {
        session[0].status = KycStatus.VALIDATED;
        await this.model.update(session[0]);
        return true;
      }
      return false;
    } catch (e) {
      if (e.message != "Index can't be found for query.") throw e;
      else throw new HttpException(`KYC-Session not found for ${sessionId}`, 500);
    }
  }
}
