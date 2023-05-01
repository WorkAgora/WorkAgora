import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NonceDTO } from '../../dtos/auth/nonce.dto';
import { LoginDTO } from '../../dtos/auth/login.dto';
import { JwtDTO } from '../../dtos/auth/jwt.dto';
import { Request } from 'express';
import { RegisterDTO } from '../../dtos/auth/register.dto';
import { SiweAuthGuard } from './siwe.guard';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

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
    const guardWallet = (req as any).user as string;
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

  /*@Post('login')
  @ApiOperation({ summary: 'Login with a SIWE message' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ status: 201, description: 'Return JWT tokens', type: JwtDTO })
  @ApiResponse({ status: 401, description: 'SiweMessage Error or Unauthorized authentication' })
  @ApiResponse({
    status: 500,
    description: 'Unexpected Error while login'
  })
  async login(@Body() payload: LoginDTO, @Req() req: Request): Promise<JwtDTO> {
    const {};
    //return this.authService.login(wallet.toLowerCase())
  }*/
}
