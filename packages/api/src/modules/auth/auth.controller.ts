import { Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  getNonce(@Param('wallet') wallet: string) {
    return this.authService.getNonce(wallet);
  }
}
