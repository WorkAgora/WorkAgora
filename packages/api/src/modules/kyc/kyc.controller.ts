import { Controller, Post, Req, Res } from '@nestjs/common';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('webhook')
  async handleWebhook(@Req() req, @Res() res) {
    const secret = req.query.secret;
    if (secret && secret === process.env.SYNAPS_WEBHOOK_SECRET) {
      const { session_id, state, service, reason } = req.body;
      const existStep = await this.kycService.findStepBySessionIdAndService(session_id, service);
      if (existStep && existStep.state !== state) {
        await this.kycService.updateStepById(session_id, service, {
          state,
          rejectionReason: reason,
        });
        await this.kycService.checkForFinalValidation(session_id);
      }
    }
    res.status(200).send();
  }
}
