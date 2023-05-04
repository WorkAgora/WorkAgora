import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException
} from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Auth, AuthKey } from './auth.interface';
import { generateNonce, SiweMessage } from 'siwe';
import { NonceDTO } from '../../dtos/auth/nonce.dto';
import { UserService } from '../user/user.service';
import { RegisterDTO } from '../../dtos/auth/register.dto';
import { CreateUserDTO } from '../../dtos/auth/create-user.dto';
import { omit } from 'lodash';
import { JwtDTO } from '../../dtos/auth/jwt.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor(
    @InjectModel('Auth')
    private readonly model: Model<Auth, AuthKey>
  ) {}

  public async getNonce(wallet: string): Promise<NonceDTO> {
    try {
      const createdAuth = await this.model.create(
        {
          wallet: wallet,
          nonce: generateNonce(),
          nonceTimeout: new Date(Date.now() + 30 * 60 * 1000)
        },
        { overwrite: true, return: 'item' }
      );
      return { nonce: createdAuth.nonce };
    } catch (error) {
      throw new UnprocessableEntityException(error, error.message);
    }
  }

  public async validateNonce(siweMessage: SiweMessage): Promise<string> {
    if (siweMessage.nonce === null) throw new HttpException('Nonce must not be null', 401);
    const res = await this.model.query('wallet').eq(siweMessage.address.toLowerCase()).exec();
    if (res.count === 0) throw new HttpException('Nonce not valid', 401);
    if (res[0].nonce !== siweMessage.nonce) throw new HttpException('Nonce not valid', 401);
    await this.model.create(
      {
        wallet: siweMessage.address.toLowerCase()
      },
      { overwrite: true, return: 'item' }
    );
    return siweMessage.address.toLowerCase();
  }

  public async validateSiweMessage(
    req: Request,
    message: string,
    signature: string
  ): Promise<string> {
    let siweMessage: SiweMessage | undefined;
    try {
      siweMessage = new SiweMessage(message);
    } catch (e) {
      throw new HttpException(e.message, 401);
    }

    if (new Date(siweMessage.expirationTime).getTime() < new Date().getTime()) {
      throw new HttpException('Message is expired', 401);
    }
    const wallet = await this.validateNonce(siweMessage);

    const { success, error, data } = await siweMessage.verify({
      signature,
      domain: process.env.FRONT_URL,
      nonce: siweMessage.nonce,
      time: new Date().toISOString()
    });

    if (wallet.toLowerCase() != data.address.toLowerCase())
      throw new HttpException('Bad address for signature', 401);

    if (success) {
      return wallet;
    }
    throw new HttpException(error, 401);
  }

  public async register(payload: RegisterDTO): Promise<boolean> {
    try {
      const newUser: CreateUserDTO = {
        ...omit(payload, ['agreeTOS', 'agreeDataTreatment', 'message', 'signature']),
        tosAcceptedOn: new Date(Date.now())
      };
      await this.userService.create(newUser);
      return true;
    } catch (error) {
      throw new UnprocessableEntityException(error, error.message);
    }
  }

  public async login(wallet: string): Promise<JwtDTO> {
    return {
      accessToken: this.jwtService.sign({ wallet }, { expiresIn: '300s' }),
      refreshToken: this.jwtService.sign({ wallet }, { expiresIn: '604800s' })
    };
  }

  public async refreshTokens(refreshToken: string): Promise<JwtDTO> {
    try {
      const payload = omit(this.jwtService.verify(refreshToken), ['iat', 'exp']);
      return {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '300s'
        }),
        refreshToken
      };
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new HttpException('Refresh token expired', 401);
      }
      throw new HttpException(`Error refreshing token ${e.message}`, 500);
    }
  }
}
