import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ConfirmJob, CreateJob, JobKey } from '@workagora/utils';
import { ConfirmJobContractDTO, CreateJobDTO } from '../../dtos/job/job.dto';
import { encodeJSONForIPFS } from '../../../../utils/src/index';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { DeleteJobDTO } from '../../dtos/job/delete-job.dto';
import { SortOrder } from 'dynamoose/dist/General';

@Injectable()
export class JobService {
  constructor(
    @InjectModel('Job')
    private readonly model: Model<CreateJob, JobKey>
  ) {}

  /**
   * Get all jobs created by the current user
   * @param wallet
   */
  async getMyJobs(wallet: string): Promise<CreateJobDTO[]> {
    const jobs = await this.model.scan({ contractorWallet: wallet }).exec();
    return jobs.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /**
   * Create a new job
   * @param wallet The employer's wallet
   * @param createJobDto The job metadata
   * @returns The job metadata
   * @throws UnprocessableEntityException
   */
  async createJob(wallet: string, createJobDto: CreateJobDTO): Promise<CreateJob> {
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
        !createJobDto.companyUuid
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

      const job: CreateJob = {
        uuid: uuidv4(),
        contractorWallet: wallet,
        createdAt: new Date().toISOString(),
        ...createJobDto
      };

      return await this.model.create(job);
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
   * Confirm a new job contract
   * @param job The job contract metadata
   * @param contractorSignature The contractor's signature
   * @param employerSignature The employer's signature
   * @returns The JobContract Creation on-chain parameters and signatures
   */
  async confirmJob(
    job: ConfirmJobContractDTO,
    contractorSignature: string,
    employerSignature: string
  ): Promise<ConfirmJob> {
    try {
      // Check that the employer and contractor are not the same
      if (job.employerWallet === job.contractorWallet) {
        throw new Error('Employer and contractor cannot be the same');
      }

      // Create the job contract metadata (JM)
      const JM = { ...job };

      // Check that the signatures are valid and sign the JM
      const messageHash = ethers.utils.hashMessage(JSON.stringify(JM));
      const recoveredContractor = ethers.utils.verifyMessage(messageHash, contractorSignature);
      if (recoveredContractor !== job.contractorWallet) {
        throw new Error('Invalid contractor signature');
      }
      const recoveredEmployer = ethers.utils.verifyMessage(messageHash, employerSignature);
      if (recoveredEmployer !== job.employerWallet) {
        throw new Error('Invalid employer signature');
      }

      // Construct JobContract Metadata IPFS (JMI)
      const JMI = {
        ...JM,
        contractorSignature: contractorSignature,
        employerSignature: employerSignature
      };

      // Encode the JMI for IPFS
      const cidStringified = await encodeJSONForIPFS(JMI);

      // Construct JobContract Creation on-chain parameters (JCC)
      const JCC = {
        ...JM,
        cid: cidStringified,
        GUID: uuidv4()
      };

      // Save the contract in the database
      // await this.model.create(JCC);

      // Send the JCC and signatures to the user
      return JCC;
    } catch (error) {
      throw new UnprocessableEntityException(
        'Error while creating the job contract',
        error.message
      );
    }
  }

  /**
   * Get recent jobs
   * @param limit Number of jobs to return
   * @returns The list of recent jobs
   * @throws UnprocessableEntityException
   */
  async getRecentJobs(limit: number): Promise<CreateJobDTO[]> {
    try {
      const jobs = await this.model
        .query('visibility')
        .eq('Public')
        .using('visibilityIndex')
        .sort(SortOrder.descending)
        .limit(limit)
        .exec();

      if (!jobs) {
        console.log('No jobs found');
        return [];
      }

      return jobs;
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
      // Query jobs based on title
      const jobs = await this.model
        .scan({ title: { contains: searchTerm }, visibility: 'public' })
        .exec();

      // Sort jobs by descending date
      jobs.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      const maxPage = Math.ceil(jobs.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      return {
        jobs: jobs.slice(startIndex, endIndex),
        maxPage: maxPage,
        totalResult: jobs.length
      };
    } catch (error) {
      throw new UnprocessableEntityException('Error while searching jobs: ' + error.message);
    }
  }
}
