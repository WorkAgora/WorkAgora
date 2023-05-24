import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Logger,
  Param,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@workagora/utils';
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
      return await this.userService.changeUserType(req.user.wallet.toLowerCase(), userType);
    } catch (e) {
      throw new HttpException('An unexpected error occurred:' + e.message, e.status || 500);
    }
  }

  @Get('searchFreelancer/:page/:limit')
  @ApiOperation({ summary: 'Search for freelancer' })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Term to search users. Separate multiple terms with a comma',
    type: String
  })
  @ApiParam({
    name: 'page',
    description: 'Page for freelancers to return',
    required: true,
    schema: { type: 'integer', default: 1 }
  })
  @ApiParam({
    name: 'limit',
    description: 'Limit for freelancers to return',
    required: true,
    schema: { type: 'integer', default: 8 }
  })
  @ApiResponse({
    status: 200,
    description: 'Users details',
    type: () => ({
      users: [UserDTO],
      maxPage: Number,
      totalResult: Number
    })
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
    @Req() req: Request,
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Query('searchTerm') searchTerm?: string
  ): Promise<{ users: UserDTO[]; maxPage: number; totalResult: number }> {
    try {
      return await this.userService.searchUsers(searchTerm, page, limit);
    } catch (e) {
      throw new HttpException('An unexpected error occurred:' + e.message, e.status || 500);
    }
  }

  @Get('searchFreelancerLogged/:page/:limit')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search for freelancer' })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Term to search users',
    type: String
  })
  @ApiParam({
    name: 'page',
    description: 'Page for freelancers to return',
    required: true,
    schema: { type: 'integer', default: 1 }
  })
  @ApiParam({
    name: 'limit',
    description: 'Limit for freelancers to return',
    required: true,
    schema: { type: 'integer', default: 8 }
  })
  @ApiResponse({
    status: 200,
    description: 'Users details',
    type: () => ({
      users: [UserDTO],
      maxPage: Number,
      totalResult: Number
    })
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async searchUsersLogged(
    @Req() req: Request,
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Query('searchTerm') searchTerm?: string
  ): Promise<{ users: UserDTO[]; maxPage: number; totalResult: number }> {
    Logger.log(JSON.stringify(req.user));
    try {
      return await this.userService.searchUsers(searchTerm, page, limit, req.user.wallet);
    } catch (e) {
      throw new HttpException('An unexpected error occurred:' + e.message, e.status || 500);
    }
  }

  @Get('recentFreelancer/:limit')
  @ApiOperation({ summary: 'Get recent freelancers' })
  @ApiParam({
    name: 'limit',
    description: 'Limit for freelancers to return',
    required: true,
    schema: { type: 'integer', default: 8 }
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
  async getRecentFreelancers(@Param('limit') limit: number): Promise<UserDTO[]> {
    try {
      if (!limit || limit < 1) {
        throw new HttpException('Bad Request', 400);
      }
      const freelancers = await this.userService.getRecentFreelancers(limit);
      return freelancers;
    } catch (e) {
      throw new HttpException('An unexpected error occurred:' + e.message, e.status || 500);
    }
  }
}
