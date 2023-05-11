import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEthereumAddress, IsIn, IsString } from 'class-validator';
import { IsTrue } from '../../validators/isTrue';
import { LoginDTO } from './login.dto';

export class RegisterDTO extends LoginDTO {
  @ApiProperty({ type: String, required: true })
  @IsEthereumAddress()
  wallet: string;

  @ApiProperty({ type: String, required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  firstname: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  lastname: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsIn(['freelance', 'company'])
  currentUserType: string;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @IsTrue()
  agreeTOS: boolean;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  @IsTrue()
  agreeDataTreatment: boolean;
}
