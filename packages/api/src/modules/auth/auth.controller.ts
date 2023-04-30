import { Body, Controller, Get, HttpException, Inject, Param, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NonceDTO } from '../../dtos/auth/nonce.dto';
import { LoginDTO } from '../../dtos/auth/login.dto';
import { JwtDTO } from '../../dtos/auth/jwt.dto';
import { Validate } from '../../decorators/validate.decorator';
import { LoginSchema } from '../../schemas/auth/login.schema';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
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
    description: 'Can not provide nonce'
  })
  @ApiResponse({
    status: 500,
    description: 'Other unknown errors'
  })
  async getNonce(@Param('wallet') wallet: string): Promise<NonceDTO> {
    try {
      return this.authService.getNonce(wallet.toLowerCase());
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with a SIWE message' })
  @ApiBody({ type: LoginDTO })
  @Validate(LoginSchema)
  @ApiResponse({ status: 201, description: 'Return JWT tokens', type: JwtDTO })
  @ApiResponse({ status: 401, description: 'Unauthorized authentication' })
  @ApiResponse({
    status: 401,
    description: 'SiweMessage Error: Message is expired'
  })
  @ApiResponse({
    status: 401,
    description: 'SiweMessage Error: Nonce not valid'
  })
  @ApiResponse({
    status: 401,
    description: 'SiweMessage Error: Bad address for signature'
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected Error while login'
  })
  async login(@Body() payload: LoginDTO, @Req() req: Request): Promise<JwtDTO> {
    const {};
    //return this.authService.login(wallet.toLowerCase())
  }
}
