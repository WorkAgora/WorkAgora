import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { Auth, AuthKey } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth')
    private readonly model: Model<Auth, AuthKey>
  ) {}

  public async getNonce(wallet: string): Promise<string> {
    //@TODO: check if wallet already have a nonce to create a new one
    const createdAuth = await this.model.create({
      id: uuidv4(),
      wallet: wallet,
      nonce: uuidv4(),
      nonceTimeout: new Date(Date.now() + 30 * 60 * 1000)
    });

    // Return the generated nonce
    return createdAuth.nonce;
  }
}
