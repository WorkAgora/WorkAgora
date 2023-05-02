import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ type: String, required: true })
  @IsEthereumAddress()
  wallet: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  message: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  signature: string;
}
