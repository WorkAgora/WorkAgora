import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CompleteJobContractDTO, CreateJobContractDTO } from '../../dtos/job/job.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { JobService } from './job.service';
import { JobCreationResponse } from './job.interface';

@ApiTags('job')
@Controller('jobs')
export class JobController {
  @Inject(JobService)
  private readonly jobService: JobService;

  @Post('create')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new job contract' })
  @ApiResponse({
    status: 200,
    description: 'The job contract creation on-chain parameters and signatures',
    type: CompleteJobContractDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async createJob(
    @Body() completeJobContractDTO: CompleteJobContractDTO
  ): Promise<JobCreationResponse> {
    const { signatures, ...jobContractDTO } = completeJobContractDTO;
    return this.jobService.createJob(
      jobContractDTO,
      signatures.contractorSignature,
      signatures.employerSignature
    );
  }
}
