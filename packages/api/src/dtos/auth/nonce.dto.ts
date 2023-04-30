import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NonceDTO {
  @ApiProperty({ type: String, required: true })
  @IsString()
  nonce: string;
}
