import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { CreateCompanyDTO } from '../../dtos/company/create-company.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CompanyService } from './company.service';
import { CreateCompany } from '@workagora/utils';
import { Request } from 'express';
import { DeleteCompanyDTO } from '../../dtos/company/delete-company.dto';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 200,
    description: 'The company creation parameters',
    type: CreateCompanyDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async createCompany(
    @Req() req: Request,
    @Body() createCompanyDTO: CreateCompanyDTO
  ): Promise<CreateCompany> {
    return this.companyService.createCompany(req.user.wallet, createCompanyDTO);
  }

  @Get('my-companies')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all companies created by the current user' })
  @ApiResponse({
    status: 200,
    description: 'The company metadata',
    type: [CreateCompanyDTO]
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getMyCompanies(@Req() req: Request): Promise<CreateCompanyDTO[]> {
    return this.companyService.getMyCompanies(req.user.wallet);
  }

  @Get('/:uuid')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a company by its uuid' })
  @ApiResponse({
    status: 200,
    description: 'The company with the given uuid',
    type: CreateCompanyDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getCompany(@Param('uuid') uuid: string): Promise<CreateCompanyDTO> {
    return this.companyService.getCompany(uuid);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({
    status: 200,
    description: 'The company deletion status',
    type: Boolean
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async deleteCompany(
    @Req() req: Request,
    @Body() deleteCompanyDto: DeleteCompanyDTO
  ): Promise<{ message: string; deleted: boolean }> {
    return this.companyService.deleteCompany(req.user.wallet, deleteCompanyDto);
  }

  @Put('/:uuid')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a company' })
  @ApiResponse({
    status: 200,
    description: 'The updated company',
    type: CreateCompanyDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async updateCompany(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Body() updateCompanyDto: CreateCompanyDTO
  ): Promise<CreateCompanyDTO> {
    return this.companyService.updateCompany(req.user.wallet, uuid, updateCompanyDto);
  }
}
