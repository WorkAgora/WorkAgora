// dtos/user/create-user.dto.ts
import { IsEmail, IsEthereumAddress, IsIn, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEthereumAddress()
  wallet: string;

  @IsEmail()
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  @IsIn(['Freelancer', 'Employer'])
  userType: string;
}
