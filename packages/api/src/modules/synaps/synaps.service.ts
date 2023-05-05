import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Model} from 'nestjs-dynamoose';
import { InjectModel } from 'nestjs-dynamoose';
import { SynapseSessionInterface } from './synaps.interface';

export type SessionKey = Pick<SynapseSessionInterface, 'sessionId'>;

@Injectable()
export class SynapsService {
  private readonly baseUrl = 'https://individual-api.synaps.io/v3';

  constructor(
    private httpService: HttpService,
    @InjectModel('Session') private readonly sessionModel: Model<SynapseSessionInterface, SessionKey>,
  ) {}

  async initSession(alias: string, clientId: string, apiKey: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .post(
        `${this.baseUrl}/session/init`,
        { alias },
        { headers: { 'Client-Id': clientId, 'Api-Key': apiKey } }
      )
      .toPromise();

    // Store the session in DynamoDB
    const sessionData: SynapseSessionInterface = {
      sessionId: response.data.session_id,
      sandbox: response.data.sandbox,
      alias
    };

    await this.sessionModel.create(sessionData);
    return response;
  }

  async getSessionInfo(
    sessionId: string,
    clientId: string,
    apiKey: string
  ): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${this.baseUrl}/session/info`, {
        headers: { 'Client-Id': clientId, 'Api-Key': apiKey, 'Session-Id': sessionId }
      })
      .toPromise();
  }

  async listSessionsWithAlias(alias: string, apiKey: string): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${this.baseUrl}/session/alias`, { headers: { 'Api-Key': apiKey }, params: { alias } })
      .toPromise();
  }

  async listSessions(state: string, alias: string, apiKey: string): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${this.baseUrl}/session/list/${state}`, {
        headers: { 'Api-Key': apiKey },
        params: { alias }
      })
      .toPromise();
  }

  async getOnboardingOverview(sessionId: string): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${this.baseUrl}/onboarding/overview`, { headers: { 'Session-Id': sessionId } })
      .toPromise();
  }

  async getOnboardingDetails(
    sessionId: string,
    clientId: string,
    apiKey: string
  ): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${this.baseUrl}/onboarding/details`, {
        headers: { 'Client-Id': clientId, 'Api-Key': apiKey, 'Session-Id': sessionId }
      })
      .toPromise();
  }
}
