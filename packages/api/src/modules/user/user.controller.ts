import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.interface';
import { UserDTO } from '../../dtos/user/user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateProfileDTO } from '../../dtos/user/update-profile.dto';
import { Request } from 'express';
import { ChangeUserTypeDTO } from '../../dtos/user/change-user-type-dto';
import { UserTypeEnum } from '../../../../utils/src/index';

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
    // @ts-ignore
    return req.user;
  }

  @Get(':wallet')
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
  async getUser(@Param('wallet') wallet: string, @Req() req: Request): Promise<User> {
    // @ts-ignore
    const authenticatedUserWallet = req.user.toLowerCase();
    const requestedUserWallet = wallet.toLowerCase();

    if (authenticatedUserWallet !== requestedUserWallet) {
      throw new HttpException(
        "Forbidden: You cannot query another user's information without their consent.",
        403
      );
    }

    try {
      const user = await this.userService.findUserByWallet(requestedUserWallet);
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

  @Put('updateProfile')
  @UseGuards(JwtAuthGuard)
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
  async updateProfile(
    @Req() req: Request,
    @Body() updatedProfile: UpdateProfileDTO
  ): Promise<UserDTO> {
    // @ts-ignore
    if (updatedProfile.wallet.toLowerCase() !== req.user.wallet.toLowerCase()) {
      throw new HttpException('Invalid wallet address', 403);
    }
    try {
      // Update the profile based on the currentUserType
      if (updatedProfile.currentUserType === UserTypeEnum.Freelancer) {
        // Update FreelancerProfile
        return await this.userService.updateFreelancerProfile(
          updatedProfile.wallet.toLowerCase(),
          updatedProfile.freelanceProfile
        );
      } else if (updatedProfile.currentUserType === UserTypeEnum.Company) {
        // Update EmployerProfile
        return await this.userService.updateEmployerProfile(
          updatedProfile.wallet.toLowerCase(),
          updatedProfile.employerProfile
        );
      } else {
        throw new HttpException('Bad Request', 400);
      }
    } catch (e) {
      throw new HttpException('An unexpected error occurred', 500);
    }
  }

  @Put('changeUserType')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user type' })
  @ApiResponse({
    status: 200,
    description: 'User type changed successfully',
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
    description: 'The new user type',
    type: ChangeUserTypeDTO
  })
  async changeUserType(
    @Req() req: Request,
    @Body('userType') userType: UserTypeEnum
  ): Promise<UserDTO> {
    if (!Object.values(UserTypeEnum).includes(userType)) {
      throw new HttpException('Invalid user type', 400);
    }
    try {
      // @ts-ignore
      return await this.userService.changeUserType(req.user.wallet.toLowerCase(), userType);
    } catch (e) {
      throw new HttpException('An unexpected error occurred:' + e.message, e.status || 500);
    }
  }
  @Get('search/:searchTerm')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search for users' })
  @ApiResponse({
    status: 200,
    description: 'Users details',
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
  async searchUsers(
    @Param('searchTerm') searchTerm: string,
    @Req() req: Request
  ): Promise<UserDTO[]> {
    try {
      return await this.userService.searchUsers(searchTerm);
    } catch (e) {
      throw new HttpException('An unexpected error occurred:' + e.message, e.status || 500);
    }
  }
  @Get('recentFreelancer/:page')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get recent freelancers' })
  @ApiParam({
    name: 'page',
    description: 'Page number for pagination',
    required: true,
    schema: { type: 'integer', default: 1 }
  })
  @ApiResponse({
    status: 200,
    description: 'The list of recent freelancers',
    type: [UserDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getRecentFreelancers(
    @Param('page') page: number,
    @Query('limit') limit: number
  ): Promise<UserDTO[]> {
    try {
      return await this.userService.getRecentFreelancers(page, limit);
    } catch (e) {
      throw new HttpException('An unexpected error occurred:' + e.message, e.status || 500);
    }
  }
}
