import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class ChangeUserTypeDTO {
  @ApiProperty({
    description: 'The new user type',
    type: String,
    required: true,
    example: 'freelance'
  })
  @IsString()
  @IsIn(['freelance', 'company'])
  userType: string;
}
