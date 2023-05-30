import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { CompleteJobContractDTO, CreateJobDTO } from '../../dtos/job/job.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { JobService } from './job.service';
import { CreateJob } from '@workagora/utils';
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
  async createJob(@Req() req: Request, @Body() createJobDTO: CreateJobDTO): Promise<CreateJobDTO> {
    return this.jobService.createJob(req.user.wallet, createJobDTO);
  }

  @Get('/my')
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

  @Get('search/:page/:limit')
  @ApiOperation({ summary: 'Search for jobs' })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Term to search jobs. Separate multiple terms with a comma',
    type: String
  })
  @ApiParam({
    name: 'page',
    description: 'Page for jobs to return',
    required: true,
    schema: { type: 'integer', default: 1 }
  })
  @ApiParam({
    name: 'limit',
    description: 'Limit for jobs to return',
    required: true,
    schema: { type: 'integer', default: 8 }
  })
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
    @Param('page') page: string,
    @Param('limit') limit: string,
    @Query('searchTerm') searchTerm?: string
  ): Promise<{ jobs: CreateJobDTO[]; maxPage: number; totalResult: number }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    if (!searchTerm || searchTerm === '') {
      return await this.jobService.getRecentJobs(pageNumber, limitNumber);
    }
    return this.jobService.searchJobs(searchTerm, pageNumber, limitNumber);
  }

  @Get('recent/:page/:limit')
  @ApiOperation({ summary: 'Get the most recent jobs' })
  @ApiParam({
    name: 'limit',
    description: 'Limit for jobs to return',
    required: true,
    schema: { type: 'integer', default: 8 }
  })
  @ApiParam({
    name: 'page',
    description: 'Page for jobs to return',
    required: true,
    schema: { type: 'integer', default: 1 }
  })
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
  async getRecentJobs(
    @Param('page') page: number,
    @Param('limit') limit: number
  ): Promise<{
    jobs: CreateJobDTO[];
    maxPage: number;
    totalResult: number;
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    return this.jobService.getRecentJobs(pageNumber, limitNumber);
  }

  @Get('/:uuid')
  @ApiOperation({ summary: 'Get a job by its UUID' })
  @ApiResponse({
    status: 200,
    description: 'The job with the given UUID',
    type: CreateJobDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found'
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred'
  })
  async getJobByUUID(@Param('uuid') uuid: string): Promise<CreateJobDTO> {
    return this.jobService.getJobByUUID(uuid);
  }
}
