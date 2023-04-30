import { HttpException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { Auth, AuthKey } from './auth.interface';
import { generateNonce } from 'siwe';
import { NonceDTO } from '../../dtos/auth/nonce.dto';
import { SiweMessage } from 'siwe';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth')
    private readonly model: Model<Auth, AuthKey>
  ) {}

  public async getNonce(wallet: string): Promise<NonceDTO> {
    try {
      const createdAuth = await this.model.create(
        {
          id: uuidv4(),
          wallet: wallet,
          nonce: generateNonce(),
          nonceTimeout: new Date(Date.now() + 30 * 60 * 1000)
        },
        { overwrite: true, return: 'item' }
      );
      return { nonce: createdAuth.nonce };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  public async validateNonce(
    siweMessage: SiweMessage
  ): Promise<{ wallet: string; userId: string }> {
    try {
      if (siweMessage.nonce === null) throw new HttpException('Nonce must not be null', 401);
      const auth = await this.model.query('nonce').eq(siweMessage.nonce).exec();
      if (!auth) throw new HttpException('Nonce not valid', 401);
    } catch (e) {
      throw new HttpException('Nonce not valid', 401);
    }
  }
}
