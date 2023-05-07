import { Controller, Get, HttpException, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { KycWebhookPayload } from './kyc.interface';
import { walletRegex } from '../../../../utils/src/index';
import { KycSessionDto} from "../../dtos/kyc/kyc-session.dto";
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';

@ApiTags('kyc')
@Controller('kyc')
export class KycController {
  @Inject(KycService)
  private readonly kycService: KycService;

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Synaps webhook' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
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

  @Get('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate a KYC process (get existing one if already initiated)' })
  @ApiResponse({
    status: 200,
    description: 'KYC process initiated successfully',
    type: KycSessionDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async initiateKycProcess(@Req() req: Request) {
    const { wallet } = req.user;
    if (!wallet || wallet === '0x0' || !walletRegex.test(wallet)) {
      throw new HttpException('Invalid wallet address', 403);
    }
    try {
      return await this.kycService.initiateKycProcess(wallet);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check the status of a KYC session' })
  @ApiResponse({
    status: 200,
    description: 'KYC session status retrieved successfully',
    type: String
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async checkSessionStatus(@Req() req: Request) {
    const { wallet } = req.user;
    if (!wallet || wallet === '0x0' || !walletRegex.test(wallet)) {
      throw new HttpException('Invalid wallet address', 403);
    }
    return await this.kycService.checkSessionStatus(wallet);
  }
}
