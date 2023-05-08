import {Body, Controller, Get, HttpException, Param, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {RatingService} from './rating.service';
import {RatingDTO} from '../../dtos/rating/rating.dto';
import {JwtAuthGuard} from "../auth/jwt.guard";

@ApiTags('Rating')
@Controller('rate')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}


  @Post('rate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Rate another user' })
  @ApiResponse({
    status: 200,
    description: 'Rating created successfully',
    type: RatingDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  @ApiBody({
    description: 'The rating details',
    type: RatingDTO
  })
  async rateUser(@Req() req, @Body() createRatingDTO: RatingDTO): Promise<RatingDTO> {
    try {
      const currentUser = req.user;
      if (currentUser.wallet.toLowerCase() !== createRatingDTO.wallet.toLowerCase()) {
        throw new HttpException('Unauthorized', 401);
      }

      return await this.ratingService.rateUser(createRatingDTO);
    } catch (e) {
      throw new HttpException(e.message || "An error occurred", e.status || 500);
    }
  }

  @Get('rating/:wallet')
  @ApiOperation({ summary: 'Get ratings for a user by wallet address' })
  @ApiParam({
    name: 'wallet',
    description: 'The wallet address of the user',
    required: true,
    schema: { type: 'string', default: '0x0' }
  })
  @ApiResponse({
    status: 200,
    description: 'The ratings for the user',
    type: [RatingDTO]
  })
  @ApiResponse({
    status: 404,
    description: 'Ratings not found'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getRatings(@Param('wallet') wallet: string): Promise<RatingDTO[]> {
    try {
      const ratings = await this.ratingService.getRatingsByWallet(wallet.toLowerCase());
      if (!ratings) {
        throw new HttpException('Ratings not found', 404);
      }
      return ratings;
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }
}
