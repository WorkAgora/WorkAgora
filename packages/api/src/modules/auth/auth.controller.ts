import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NonceDTO } from '../../dtos/auth/nonce.dto';
import { Request, Response } from 'express';
import { RegisterDTO } from '../../dtos/auth/register.dto';
import { SiweAuthGuard } from './siwe.guard';
import { LoginDTO } from '../../dtos/auth/login.dto';
import { UserDTO } from '../../dtos/user/user.dto';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Post('getNonce/:wallet')
  @ApiOperation({ summary: 'Generate nonce for a wallet' })
  @ApiParam({
    name: 'wallet',
    description: 'The wallet address to generate the nonce for',
    required: true,
    schema: { type: 'string', default: '0x0' }
  })
  @ApiResponse({
    status: 201,
    description: 'The generated nonce',
    type: NonceDTO
  })
  @ApiResponse({
    status: 500,
    description: 'Can not provide nonce or other unknown errors'
  })
  async getNonce(@Param('wallet') wallet: string): Promise<NonceDTO> {
    try {
      return this.authService.getNonce(wallet.toLowerCase());
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  @UseGuards(SiweAuthGuard)
  @Post('register')
  @ApiOperation({ summary: 'Register with a SIWE message' })
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({ status: 201, description: 'Return true', type: Boolean })
  @ApiResponse({ status: 401, description: 'SiweMessage Error or Unauthorized authentication' })
  @ApiResponse({
    status: 500,
    description: 'Unexpected Error while register'
  })
  async register(@Body() payload: RegisterDTO, @Req() req: Request): Promise<boolean> {
    const guardWallet = req.user as string;
    if (!guardWallet) {
      throw new HttpException(`Error while registering`, 500);
    }
    const { wallet, ...restPayload } = payload;
    if (wallet.toLowerCase() !== guardWallet)
      throw new HttpException(
        `Address for registering is different than address from signature`,
        401
      );

    return this.authService.register({ wallet: wallet.toLowerCase(), ...restPayload });
  }

  @UseGuards(SiweAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with a SIWE message' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    description: 'Return JWT tokens',
    type: UserDTO
  })
  @ApiResponse({ status: 401, description: 'SiweMessage Error or Unauthorized authentication' })
  @ApiResponse({
    status: 500,
    description: 'Unexpected Error while login'
  })
  async login(@Body() payload: LoginDTO, @Req() req: Request, @Res() res: Response): Promise<void> {
    const guardWallet = req.user as string;

    if (!guardWallet) {
      throw new HttpException(`Error while registering`, 500);
    }
    const { wallet } = payload;

    if (wallet.toLowerCase() !== guardWallet)
      throw new HttpException(`Address for login is different than address from signature`, 401);
    const user = await this.userService.findUserByWallet(wallet.toLowerCase());
    if (!user) {
      throw new HttpException(`User doesn't exist`, 401);
    }
    const jwt = await this.authService.login(wallet.toLowerCase());
    res.cookie('authToken', jwt.accessToken, {
      maxAge: 300 * 1000, // 300scd
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    res.cookie('refreshToken', jwt.refreshToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh'
    });
    res.status(200).json(user);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh JWT Token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;
    Logger.log(req);
    if (!refreshToken) {
      throw new HttpException('Unauthorized', 401);
    }

    try {
      const newTokens = await this.authService.refreshTokens(refreshToken);
      res.cookie('authToken', newTokens.accessToken, {
        maxAge: 300 * 1000, // 300scd
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      res.status(200).send('Token refreshed');
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
    }
  }
}
