import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Model } from 'nestjs-dynamoose';
import { InjectModel } from 'nestjs-dynamoose';
import { SynapsSessionInterface } from './synaps.interface';

export type SessionKey = Pick<SynapsSessionInterface, 'sessionId'>;

@Injectable()
export class SynapsService {
  constructor(
    private httpService: HttpService,
    @InjectModel('Session') private readonly sessionModel: Model<SynapsSessionInterface, SessionKey>
  ) {}

  async initSession(alias: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .post(
        `${process.env.SYNAPS_API_BASE_URL}/session/init`,
        { alias },
        { headers: { 'Client-Id': process.env.SYNAPS_CLIENT_ID, 'Api-Key': process.env.SYNAPS_API_KEY } }
      )
      .toPromise();

    // Store the session in DynamoDB
    const sessionData: SynapsSessionInterface = {
      sessionId: response.data.session_id,
      sandbox: response.data.sandbox,
      alias
    };

    await this.sessionModel.create(sessionData);
    return response;
  }

  async getSessionInfo(
    sessionId: string,
  ): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${process.env.SYNAPS_API_BASE_URL}/session/info`, {
        headers: { 'Client-Id': process.env.SYNAPS_CLIENT_ID, 'Api-Key': process.env.SYNAPS_API_KEY, 'Session-Id': sessionId }
      })
      .toPromise();
  }

  async listSessionsWithAlias(alias: string): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${process.env.SYNAPS_API_BASE_URL}/session/alias`, { headers: { 'Api-Key': process.env.SYNAPS_API_KEY }, params: { alias } })
      .toPromise();
  }

  async listSessions(state: string, alias: string): Promise<AxiosResponse> {
    return await this.httpService
      .get(`${process.env.SYNAPS_API_BASE_URL}/session/list/${state}`, {
        headers: { 'Api-Key': process.env.SYNAPS_API_KEY },
        params: { alias }
      })
      .toPromise();
  }
}
