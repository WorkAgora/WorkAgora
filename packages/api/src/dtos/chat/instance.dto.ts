import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ChatMessageDTO } from './chat.dto';
import { CreateCompanyDTO } from '../company/create-company.dto';
import { UserDTO } from '../user/user.dto';

export class ChatInstanceDTO {
  @ApiProperty({ description: 'Unique identifier of the chat instance (INSTANCE#wallet1#wallet2)' })
  @IsString()
  uuid: string;

  @ApiProperty({ description: 'My wallet address in this chat instance' })
  @IsString()
  myWallet: string;

  @ApiProperty({ description: "Partner's wallet address in this chat instance" })
  @IsString()
  partnerWallet: string;

  @ApiProperty({ description: 'Partner Name' })
  @IsString()
  partnerName: string;

  @ApiProperty({ description: 'Last message in this chat instance', type: ChatMessageDTO })
  lastMessage: ChatMessageDTO;

  @ApiProperty({ description: 'Author type of the partner in this chat instance' })
  @IsString()
  partnerType: string;

  @ApiProperty({ description: 'Job Related UUID' })
  @IsOptional()
  @IsString()
  jobRelated?: string;

  @ApiProperty({ description: 'Partner User' })
  @IsOptional()
  partnerUser?: UserDTO;

  @ApiProperty({ description: 'Partner Company' })
  @IsOptional()
  partnerCompany?: CreateCompanyDTO;
}
