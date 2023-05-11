// dtos/user/create-user.dto.ts
import { IsEmail, IsEthereumAddress, IsIn, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsIn(['freelance', 'company'])
  currentUserType: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  tosAcceptedOn: Date;
}
