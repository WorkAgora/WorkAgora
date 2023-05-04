import {
  Controller,
  Inject,
  Get,
  Param,
  HttpException,
  Req,
  UseGuards,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.interface';
import { UserDTO } from '../../dtos/user/user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user by guard' })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: UserDTO
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getCurrentUser(@Req() req: Request): Promise<UserDTO> {
    return req.user;
  }

  @Get(':wallet')
  @ApiOperation({ summary: 'Get user details by wallet address' })
  @ApiParam({
    name: 'wallet',
    description: 'The wallet address of the user',
    required: true,
    schema: { type: 'string', default: '0x0' }
  })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: UserDTO
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getUser(@Param('wallet') wallet: string): Promise<User> {
    try {
      const user = await this.userService.findUserByWallet(wallet.toLowerCase());
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (e) {
      if (e.message === 'User not found') {
        throw new HttpException('User not found', 404);
      } else {
        throw new HttpException('An unexpected error occurred', 500);
      }
    }
  }
}
