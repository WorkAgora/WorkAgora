import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ConfirmJobContractDTO, CreateJobDTO } from '../../dtos/job/job.dto';
import { ConfirmJob, encodeJSONForIPFS, JobKey, Visibility } from '../../../../utils/src/index';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { DeleteJobDTO } from '../../dtos/job/delete-job.dto';
import { SortOrder } from 'dynamoose/dist/General';
import { CompanyService } from '../company/company.service';
import { CreateJobBackend } from './job.interface';

@Injectable()
export class JobService {
  constructor(
    @InjectModel('Job')
    private readonly model: Model<CreateJobBackend, JobKey>,
    private readonly companyService: CompanyService
  ) {}

  /**
   * Get all jobs created by the current user
   * @param wallet
   */
  async getMyJobs(wallet: string): Promise<CreateJobDTO[]> {
    const jobs = await this.model.scan({ contractorWallet: wallet }).exec();

    // Sort jobs by date
    const jobsSorted = jobs.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return await this.createJobsToJobsDTO(jobsSorted);
  }

  /**
   * Create a new job
   * @param wallet The employer's wallet
   * @param createJobDto The job metadata
   * @returns The job metadata
   * @throws UnprocessableEntityException
   */
  async createJob(wallet: string, createJobDto: CreateJobDTO): Promise<CreateJobDTO> {
    try {
      // Check for missing values in createJobDto
      if (
        !createJobDto.title ||
        !createJobDto.location ||
        !createJobDto.availability ||
        !createJobDto.jobMission ||
        !createJobDto.responsibilities ||
        !createJobDto.requirements ||
        !createJobDto.visibility ||
        !createJobDto.companyUuid ||
        !createJobDto.tags
      ) {
        throw new Error('Missing required fields in createJobDto');
      }

      // Check for missing values in createJobDto.duration
      if (
        createJobDto.duration.years === undefined ||
        createJobDto.duration.months === undefined ||
        createJobDto.duration.days === undefined ||
        createJobDto.duration.hours === undefined
      ) {
        throw new Error('Missing required fields in createJobDto.duration');
      }

      const job: CreateJobBackend = {
        uuid: uuidv4(),
        contractorWallet: wallet,
        createdAt: new Date().toISOString(),
        ...createJobDto,
        tags: createJobDto.tags.join(';')
      };

      return (await this.createJobsToJobsDTO([await this.model.create(job)]))[0];
    } catch (e) {
      throw new UnprocessableEntityException('Could not create job: ' + e.message);
    }
  }

  /**
   * Delete a job
   * @param wallet The employer's wallet
   * @param deleteJobDto The job metadata
   * @returns A message confirming the deletion
   * @throws UnprocessableEntityException
   */
  async deleteJob(wallet: string, deleteJobDto: DeleteJobDTO): Promise<{ message: string }> {
    try {
      // Delete the job
      await this.model.delete({ uuid: deleteJobDto.id, contractorWallet: wallet });

      // Log the reason for deletion if provided
      if (deleteJobDto.reason) {
        console.log(`Job ${deleteJobDto.id} was deleted. Reason: ${deleteJobDto.reason}`);
      }

      return { message: 'Job deleted successfully' };
    } catch (error) {
      throw new UnprocessableEntityException('Error while deleting the job', error.message);
    }
  }

  /**
   * Get recent jobs
   * @param page
   * @param limit Number of jobs to return
   * @returns The list of recent jobs
   * @throws UnprocessableEntityException
   */
  async getRecentJobs(
    page: number,
    limit: number
  ): Promise<{ jobs: CreateJobDTO[]; maxPage: number; totalResult: number }> {
    try {
      const jobs = await this.model
        .query('visibility')
        .eq(Visibility.Public)
        .using('visibilityIndex')
        .sort(SortOrder.descending)
        .exec();

      if (!jobs) {
        console.log('No jobs found');
        return { jobs: [], maxPage: 0, totalResult: 0 };
      }

      const maxPage = Math.ceil(jobs.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      return {
        jobs: await this.createJobsToJobsDTO(jobs.slice(startIndex, endIndex)),
        maxPage: maxPage,
        totalResult: jobs.length
      };
    } catch (error) {
      console.log('Error while getting recent jobs', error);
      throw new UnprocessableEntityException('Error while getting recent jobs: ' + error.message);
    }
  }

  /**
   * Search jobs based on a search term
   * @param searchTerm The search term
   * @param page The page number
   * @param limit The number of results per page
   * @returns The list of jobs matching the search term
   * @throws UnprocessableEntityException
   */
  async searchJobs(
    searchTerm: string,
    page: number,
    limit: number
  ): Promise<{ jobs: CreateJobDTO[]; maxPage: number; totalResult: number }> {
    try {
      // Split the search term into an array of terms
      const searchTerms = searchTerm.split(';');

      // Start the scan operation
      let scanOperation = this.model.scan().where('visibility').eq(Visibility.Public);

      // For each term, add a filter for the title and tags
      searchTerms.forEach((term, index) => {
        if (index !== 0) {
          // If this is not the first term, add an 'or' before the filter
          scanOperation = scanOperation.or();
        }

        // Add the filter for the title and tags
        scanOperation = scanOperation
          .filter('title')
          .contains(term)
          .or()
          .filter('tags')
          .contains(term);
      });


      console.log('scanOperation', scanOperation);
      console.log("JSON.stringify(scanOperation)", JSON.stringify(scanOperation));

      // Execute the scan operation
      const jobs = await scanOperation.exec();

      // Sort jobs by descending date
      jobs.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      const maxPage = Math.ceil(jobs.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      return {
        jobs: await this.createJobsToJobsDTO(jobs.slice(startIndex, endIndex)),
        maxPage: maxPage,
        totalResult: jobs.length
      };
    } catch (error) {
      throw new UnprocessableEntityException('Error while searching jobs: ' + error.message);
    }
  }

  async getJobByUUID(uuid: string): Promise<CreateJobDTO> {
    try {
      const jobs = await this.model.scan({ uuid: uuid }).exec();

      if (!jobs || jobs.length === 0) {
        throw new Error('Job not found');
      }

      return (await this.createJobsToJobsDTO(jobs))[0];
    } catch (e) {
      throw new UnprocessableEntityException('Could not get job: ' + e.message);
    }
  }

  async createJobsToJobsDTO(jobs: CreateJobBackend[]): Promise<CreateJobDTO[]> {
    try {
      return await Promise.all(
        jobs.map(async (job) => {
          const company = await this.companyService.getCompany(job.companyUuid);
          return {
            ...job,
            company,
            tags: job.tags.split(';')
          };
        })
      );
    } catch (error) {
      throw new UnprocessableEntityException('Error while creating jobs DTO: ' + error.message);
    }
  }
}
