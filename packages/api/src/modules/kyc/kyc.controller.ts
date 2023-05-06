import {Controller, Get, HttpException, Inject, Param, Post, Req, Res} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {KycService} from './kyc.service';
import { KycWebhookPayload } from './kyc.interface';
import { walletRegex } from '../../../../utils/src/index';
import {KycSessionSchema} from "./kyc.schema";
import {CreateKycStepDto} from "../../dtos/kyc/create-kyc-step.dto";
import {CreateKycSessionDto} from "../../dtos/kyc/create-kyc-session.dto";

@ApiTags('kyc')
@Controller('kyc')
export class KycController {
  constructor(@Inject(KycService) private readonly kycService: KycService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Synaps webhook' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred',
  })
  async handleWebhook(@Req() req, @Res() res) {
    const secret = req.query.secret;
    if (secret && secret === process.env.SYNAPS_WEBHOOK_SECRET) {
      const { session_id, state, service } = req.body;
      const existStep = await this.kycService.findStepBySessionIdAndService(session_id, service);
      if (existStep && existStep.state !== state) {
        await this.kycService.updateStepById(session_id, service, req.body as KycWebhookPayload);
        await this.kycService.checkForFinalValidation(session_id);
      }
    }
    res.status(200).send();
  }
  @Post('initiate/:wallet')
  @ApiOperation({ summary: 'Initiate a KYC process' })
  @ApiParam({
    name: 'wallet',
    description: 'The wallet address of the user',
    required: true,
    schema: { type: 'string', default: '0x0' },
  })
  @ApiResponse({
    status: 200,
    description: 'KYC process initiated successfully',
    type: CreateKycSessionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred',
  })
  async initiateKycProcess(@Param('wallet') wallet: string) {
    if (!wallet || wallet === '0x0' || !walletRegex.test(wallet)) {
      throw new HttpException('Invalid wallet address', 400);
    }
    try {
      return await this.kycService.initiateKycProcess(wallet);
    } catch (e) {
      throw new HttpException(`An unexpected error occurred: ${e.message}`, 500);
    }
  }

  @Get('status/:sessionId')
  @ApiOperation({ summary: 'Check the status of a KYC session' })
  @ApiParam({
    name: 'sessionId',
    description: 'The session ID of the KYC process',
    required: true,
    schema: { type: 'string', default: 'sample-session-id' },
  })
  @ApiResponse({
    status: 200,
    description: 'KYC session status retrieved successfully',
    type: CreateKycSessionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred',
  })
  async checkSessionStatus(@Param('sessionId') sessionId: string) {
    try {
      const sessionStatus = await this.kycService.checkSessionStatus(sessionId);
      return sessionStatus;
    } catch (e) {
      if (e.message === "Index can't be found for query.") {
        console.log("ONE");
        throw new HttpException(`Session ${sessionId} not found`, 404);
      } else {
        console.log("TWO");
        throw new HttpException(`An unexpected error occurred: ${e.message}`, 500);
      }
    }
  }
}
