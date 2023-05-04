import {
  Controller,
  Inject,
  Get,
  Param,
  HttpException,
  Req,
  UseGuards,
  Put,
  Body
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.interface';
import { UserDTO } from '../../dtos/user/user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateProfileDTO } from '../../dtos/user/update-profile.dto';

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

  @Put('updateProfile')
  @UseGuards(JwtAuthGuard)
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

  @Put('updateProfileDto')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  @ApiBody({
    description: 'The updated profile',
    type: UpdateProfileDTO
  })
  async updateProfile(@Body() updatedProfile: UpdateProfileDTO): Promise<UserDTO> {
    try {
      // Update the profile based on the currentUserType
      if (updatedProfile.currentUserType === 'freelance') {
        // Update FreelancerProfile
        return await this.userService.updateFreelancerProfile(updatedProfile.wallet, updatedProfile.freelanceProfile);
      } else if (updatedProfile.currentUserType === 'company') {
        // Update EmployerProfile
        return await this.userService.updateEmployerProfile(updatedProfile.wallet, updatedProfile.employerProfile);
      } else {
        throw new HttpException('Bad Request', 400);
      }
    } catch (e) {
      throw new HttpException('An unexpected error occurred', 500);
    }
  }
}
