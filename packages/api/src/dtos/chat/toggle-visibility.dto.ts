import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ChatMessageDTO } from './chat.dto';

export class ToggleVisibilityDto {
  @ApiProperty({ description: 'Unique identifier of the chat instance' })
  @IsString()
  instanceUuid: string

  @ApiProperty({description: "Partner wallet"})
  @IsString()
  partnerWallet: string
}
