import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const accessToken = req.cookies?.authToken;
          const refreshToken = req.cookies?.refreshToken;
          if (req.path === '/auth/refresh' && refreshToken) {
            return refreshToken;
          }

          return accessToken;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    });
  }

  validate = async (req: Request, payload: { wallet: string }) => {
    if ('wallet' in req.params) {
      if (payload.wallet.toLowerCase() !== req.params.wallet.toLowerCase()) {
        throw new HttpException('Address and payload address missmatch', 403);
      }
    }
    return payload;
  };
}
