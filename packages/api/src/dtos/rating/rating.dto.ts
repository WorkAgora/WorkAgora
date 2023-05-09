import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class RatingDTO {
  @ApiProperty({
    description: 'The wallet address of the rating sender',
    type: String,
    required: true,
    example: '0x0'
  })
  @IsString()
  wallet: string;

  @ApiProperty({
    description: 'The wallet address of the rating receiver',
    type: String,
    required: true,
    example: '0x0'
  })
  @IsString()
  walletReceiver: string;

  @ApiProperty({
    description: 'The stars of the rating',
    type: Number,
    required: true,
    example: 5
  })
  @IsNumber()
  stars: number;

  @ApiProperty({
    description: 'The comment of the rating',
    type: String,
    required: true,
    example: 'This is a comment'
  })
  @IsString()
  comment: string;
}
