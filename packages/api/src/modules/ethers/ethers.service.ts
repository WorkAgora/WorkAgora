import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class EthersService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async signMessage(message: string): Promise<string> {
    const privateKey = this.configService.get<string>('WALLET_PRIVATE_KEY');
    const wallet = new ethers.Wallet(privateKey);
    const signedMessage = await wallet.signMessage(message);

    return signedMessage;
  }
}
