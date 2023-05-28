import { Body, Controller, Delete, Get, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CompleteJobContractDTO, CreateJobDTO } from '../../dtos/job/job.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { JobService } from './job.service';
import { CreateJob } from './job.interface';
import { Request } from 'express';
import { DeleteJobDTO } from '../../dtos/job/delete-job.dto';

@ApiTags('job')
@Controller('jobs')
export class JobController {
  @Inject(JobService)
  private readonly jobService: JobService;

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new job contract' })
  @ApiResponse({
    status: 200,
    description: 'The job contract creation parameters',
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
  async createJob(@Req() req: Request, @Body() createJobDTO: CreateJobDTO): Promise<CreateJob> {
    return this.jobService.createJob(req.user.wallet, createJobDTO);
  }

  @Get('/mine')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all jobs created by the current user' })
  @ApiResponse({
    status: 200,
    description: 'The jobs created by the current user',
    type: [CreateJobDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getMyJobs(@Req() req: Request): Promise<CreateJobDTO[]> {
    return this.jobService.getMyJobs(req.user.wallet);
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a job contract' })
  @ApiResponse({
    status: 200,
    description: 'The job contract deletion parameters',
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
  async deleteJob(
    @Req() req: Request,
    @Body() deleteJobDto: DeleteJobDTO
  ): Promise<{ message: string }> {
    return this.jobService.deleteJob(req.user.wallet, deleteJobDto);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search for jobs' })
  @ApiResponse({
    status: 200,
    description: 'The jobs matching the search criteria',
    type: [CreateJobDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async searchJobs(
    @Query('searchTerm') searchTerm: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<{ jobs: CreateJobDTO[]; maxPage: number; totalResult: number }> {
    return this.jobService.searchJobs(searchTerm, page, limit);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the most recent jobs' })
  @ApiResponse({
    status: 200,
    description: 'The most recent jobs',
    type: [CreateJobDTO]
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getRecentJobs(@Query('limit') limit: number): Promise<CreateJobDTO[]> {
    return this.jobService.getRecentJobs(limit);
  }
}
