import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request, Express } from 'express';
import { JobContractService } from './jobContract.service';
import { JobProposal } from './job-contract.interface';
import { CreateJobProposalDTO } from '../../dtos/job-contract/create-job-proposal-dto';
import { SignJobContractDTO } from '../../dtos/job-contract/sign-job-contract-dto';
import { JobContractDTO } from '../../dtos/job-contract/job-contract.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDTO } from '../../dtos/job-contract/send-file-dto';

@ApiTags('job-contract')
@Controller('job-contract')
export class JobContractController {
  @Inject(JobContractService)
  private readonly jobContractService: JobContractService;

  @Post('create')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new job proposal' })
  @ApiBody({ type: CreateJobProposalDTO })
  @ApiResponse({
    status: 200,
    description: 'The job proposal creation parameters',
    type: CreateJobProposalDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async createJobProposal(
    @Req() req: Request,
    @Body() createJobProposalDTO: CreateJobProposalDTO
  ): Promise<JobProposal> {
    return this.jobContractService.createJobProposal('req.user.wallet', createJobProposalDTO);
  }

  @Post(':proposalId/validate')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Validate a job proposal' })
  @ApiResponse({
    status: 200,
    description: 'The job proposal validation parameters',
    type: CreateJobProposalDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async validateJobProposal(@Req() req, @Body() signJobContractDTO: SignJobContractDTO) {
    return this.jobContractService.validateJobProposal('req.user.wallet', signJobContractDTO);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload File',
    type: FileUploadDTO
  })
  @ApiOkResponse({ description: 'File uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: Request,
    @Body() body: { contractId: string },
    @UploadedFile(new ParseFilePipeBuilder().build()) file: any
  ) {
    try {
      // @ts-ignore
      const walletAddress = req.user ? req.user.wallet : null;

      if (!walletAddress) {
        throw new HttpException('No wallet address provided', HttpStatus.BAD_REQUEST);
      }

      if (!file) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }

      return this.jobContractService.uploadFileSubmission(walletAddress, body.contractId, file);
    } catch (e) {
      console.log('ERROR-uploadFile-controller: ', e);
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('download/:contractId')
  @ApiOperation({ summary: 'Download a job file' })
  @ApiOkResponse({ description: 'Pre-signed URL fetched successfully' })
  async downloadJobFile(@Param('contractId') contractId: string): Promise<string> {
    try {
      return this.jobContractService.getJobFile(contractId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a job contract by UUID' })
  @ApiOkResponse({ type: JobContractDTO, description: 'Job contract fetched successfully' })
  async getJobContractByUUID(@Param('uuid') uuid: string) {
    try {
      return this.jobContractService.getJobContractByUUID(uuid);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
