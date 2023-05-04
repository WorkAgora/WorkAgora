import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(UserService)
  private readonly userService: UserService;

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

  validate = async (req: Request) => {
    if (!('wallet' in req)) {
      throw new HttpException('Not authenticated', 403);
    }
    const user = await this.userService.findUserByWallet(req.wallet as string);
    if (!user) {
      throw new HttpException(`User not found`, 403);
    }
    return user;
  };
}
