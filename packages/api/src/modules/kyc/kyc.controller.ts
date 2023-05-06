import {Controller, Get, HttpException, Inject, Param, Post, Req, Res} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {KycService} from './kyc.service';
import { KycWebhookPayload } from './kyc.interface';
import { walletRegex } from '../../../../utils/src/index';
import {CreateKycSessionDto} from "../../dtos/kyc/create-kyc-session.dto";
import * as console from "console";
import {KycStatus} from "./kyc.enum";

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
  @ApiOperation({ summary: 'Initiate a KYC process (get existing one if already initiated)' })
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
      throw new HttpException(e.message, 500);
    }
  }

  @Get('status/:wallet')
  @ApiOperation({ summary: 'Check the status of a KYC session' })
  @ApiParam({
    name: 'wallet',
    description: 'The wallet address of the user',
    required: true,
    schema: { type: 'string', default: '0x0' },
  })
  @ApiResponse({
    status: 200,
    description: 'KYC session status retrieved successfully',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred',
  })
  async checkSessionStatus(@Param('wallet') wallet: string): Promise<string> {
      const sessionStatus: KycStatus = await this.kycService.checkSessionStatus(wallet);
      if (!sessionStatus)
        throw new HttpException(`Session ${wallet} not found`, 404);
      return sessionStatus;
  }
}
