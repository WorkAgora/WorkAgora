import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class SiweStrategy extends PassportStrategy(Strategy, 'SIWE') {
  @Inject(AuthService)
  private readonly authService: AuthService;

  constructor() {
    super({
      usernameField: 'message',
      passwordField: 'signature',
      passReqToCallback: true
    });
  }

  async validate(req: Request, message: string, signature: string) {
    const wallet = await this.authService.validateSiweMessage(req, message, signature);
    if (wallet) {
      return wallet;
    }
    throw new UnauthorizedException();
  }
}
