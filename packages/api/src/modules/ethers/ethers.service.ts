import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class EthersService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async signMessage(messageDatas: { type: string; value: string }[]): Promise<string> {
    const privateKey = this.configService.get<string>('WALLET_PRIVATE_KEY');
    const wallet = new ethers.Wallet(privateKey);

    const types = messageDatas.map((message) => message.type);
    const values = messageDatas.map((message) => message.value);

    const messageHash = ethers.utils.solidityKeccak256(types, values);
    const signedMessage = await wallet.signMessage(ethers.utils.arrayify(messageHash));

    return signedMessage;
  }
}
