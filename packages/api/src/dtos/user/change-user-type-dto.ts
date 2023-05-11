import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';
import {UserTypeEnum} from "../../../../utils/src/index";

export class ChangeUserTypeDTO {
  @ApiProperty({
    description: 'The new user type',
    type: String,
    required: true,
    example: 'freelance'
  })
  @IsString()
  @IsIn(Object.values(UserTypeEnum))
  userType: string;
}
