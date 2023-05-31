import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ToggleVisibilityDto {
  @ApiProperty({ description: 'Unique identifier of the chat instance (INSTANCE#wallet1#wallet2)' })
  @IsString()
  instanceUuid: string;

  @ApiProperty({ description: 'Partner wallet' })
  @IsString()
  partnerWallet: string;
}
