import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class JwtDTO {
  @ApiProperty({ type: String, required: true })
  @IsJWT()
  accessToken: string;

  @ApiProperty({ type: String, required: true })
  @IsJWT()
  refreshToken: string;
}
