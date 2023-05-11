import { IsEmail, IsEthereumAddress, IsIn, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import {UserTypeEnum} from "../../../../utils/src/index";

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
  @IsIn(Object.values(UserTypeEnum))
  currentUserType: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  tosAcceptedOn: Date;
}
