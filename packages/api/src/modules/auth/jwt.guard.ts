import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    const req = context.getRequest();
    if (info == 'TokenExpiredError: jwt expired') {
      if (req.path != '/auth/refresh') {
        throw new HttpException('ACCESS_TOKEN_EXPIRED', 401);
      }
      throw new HttpException('REFRESH_TOKEN_EXPIRED', 401);
    }

    if (info == 'Error: No auth token') {
      if (req.path == '/auth/refresh') {
        throw new HttpException('NO_TOKEN_PROVIDED', 401);
      }
      throw new HttpException('ACCESS_TOKEN_EXPIRED', 401);
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
