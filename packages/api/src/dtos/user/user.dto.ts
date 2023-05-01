import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDTO {
  @ApiProperty({ type: String, required: true })
  @IsString()
  wallet: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  email: string;
}
