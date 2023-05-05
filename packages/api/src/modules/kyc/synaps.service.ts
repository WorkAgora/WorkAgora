import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class SynapsService {
  private readonly baseUrl = 'https://individual-api.synaps.io/v3';

  constructor(private httpService: HttpService) {}

  async initSession(alias: string, clientId: string, apiKey: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .post(
        `${this.baseUrl}/session/init`,
        { alias },
        { headers: { 'Client-Id': clientId, 'Api-Key': apiKey } }
      )
      .toPromise();
    return response;
  }

  async getSessionInfo(
    clientId: string,
    sessionId: string,
    apiKey: string
  ): Promise<AxiosResponse> {
    const response = await this.httpService
      .get(`${this.baseUrl}/session/info`, {
        headers: { 'Client-Id': clientId, 'Session-Id': sessionId, 'Api-Key': apiKey }
      })
      .toPromise();
    return response;
  }

  async listSessionsWithAlias(alias: string, apiKey: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .get(`${this.baseUrl}/session/alias`, { params: { alias }, headers: { 'Api-Key': apiKey } })
      .toPromise();
    return response;
  }

  async listSessions(state: string, alias: string, apiKey: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .get(`${this.baseUrl}/session/list/${state}`, {
        params: { alias },
        headers: { 'Api-Key': apiKey }
      })
      .toPromise();
    return response;
  }

  async getOverview(sessionId: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .get(`${this.baseUrl}/onboarding/overview`, { headers: { 'Session-Id': sessionId } })
      .toPromise();
    return response;
  }

  async getDetails(sessionId: string, clientId: string, apiKey: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .get(`${this.baseUrl}/onboarding/details`, {
        headers: { 'Session-Id': sessionId, 'Client-Id': clientId, 'Api-Key': apiKey }
      })
      .toPromise();
    return response;
  }
}
