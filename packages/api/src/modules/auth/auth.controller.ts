import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    type: String
  })
  @ApiResponse({
    status: 200,
    description: 'The generated nonce',
    type: String
  })
  async getNonce(@Param('wallet') wallet: string) {
    return await this.authService.getNonce(wallet);
  }
}
