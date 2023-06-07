import { Injectable, UnprocessableEntityException, UploadedFile } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';
import {
  getJobContractKey,
  getJobFileKey,
  getJobProposalKey,
  JobContract,
  JobContractDocument,
  JobContractKey,
  JobContractStatus,
  JobFile,
  JobProposal
} from './job-contract.interface';
import { createHash } from 'crypto';
import { CreateJobProposalDTO } from '../../dtos/job-contract/create-job-proposal-dto';
import { JobService } from '../job/job.service';
import { CompanyService } from '../company/company.service';
import {
  createSignableMessage,
  encodeJSONForIPFS,
  mySignMessage,
  storeJSONToIPFS,
  verifySignature
} from '../../../../utils/src/index';
import { SignJobContractDTO } from '../../dtos/job-contract/sign-job-contract-dto';
import S3 from 'aws-sdk/clients/s3';

@Injectable()
export class JobContractService {
  constructor(
    @InjectModel('JobContract')
    private readonly model: Model<JobContractDocument, JobContractKey>,
    private readonly jobService: JobService,
    private readonly companyService: CompanyService
  ) {}

  /**
   * Create a new JobProposal
   * @param wallet The employer's wallet
   * @param createJobProposalDto The job proposal metadata
   * @returns The job proposal metadata
   * @throws UnprocessableEntityException
   */
  async createJobProposal(
    wallet: string,
    createJobProposalDto: CreateJobProposalDTO
  ): Promise<JobProposal> {
    try {
      const jobProposal = {
        PK: `JobProposal#${uuidv4()}`,
        SK: '#METADATA',
        createdAt: new Date().toISOString(),
        open: JobContractStatus.None,
        freelancerValidated: false,
        ...createJobProposalDto
      };

      // Check if the Duration is valid with the Job's duration
      const currentDateTime = new Date();
      const expectedStartDateTime = new Date(currentDateTime);

      expectedStartDateTime.setFullYear(
        currentDateTime.getFullYear(),
        currentDateTime.getMonth(),
        currentDateTime.getDate() + createJobProposalDto.durationInDay
      );

      const startExpiryDate = new Date(createJobProposalDto.creationExpiryTimestamp);

      if (startExpiryDate < expectedStartDateTime) {
        throw new Error('Expiry date must be after the end of work duration.');
      }

      await this.model.create(jobProposal);

      return jobProposal;
    } catch (error) {
      console.log('createJobProposal: ' + error.message);
      throw new UnprocessableEntityException('createJobProposal: ' + error.message);
    }
  }

  // TODO return to dto
  async getJobProposalById(id: string): Promise<JobProposal> {
    const query = await this.model.query('PK').eq(id).exec();

    if (!query || query.length === 0) {
      throw new Error('Job proposal not found.');
    }

    const jobProposal = query[0] as JobProposal;

    return jobProposal;
  }

  /**
   * Validate a job proposal (for freelancer, we assume that the employer already validated the job proposal)
   * @param wallet The freelancer's wallet
   * @param proposalId The job proposal id
   * @returns The job proposal metadata
   * @throws UnprocessableEntityException
   */
  async validateJobProposal(wallet: string, proposalId: SignJobContractDTO) {
    try {
      let { jobProposalId } = proposalId;
      const { signature } = proposalId;

      // if the proposal id don't contain the prefix, add it
      if (!jobProposalId.startsWith('JobProposal#')) {
        jobProposalId = getJobProposalKey(jobProposalId).PK;
      }

      const query = await this.model.query('PK').eq(jobProposalId).exec();

      if (!query || query.length === 0) {
        throw new Error('Job proposal not found.');
      }

      const jobContractProposal = query[0] as JobProposal;

      // Get Freelancer signature from request body, verify message -> store in JobContract as freelancerSignature
      if (jobContractProposal.freelancerWallet === wallet) {
        const signableMessage = createSignableMessage(jobContractProposal);

        const signerWallet = verifySignature(signableMessage, signature);
        if (signerWallet.toLowerCase() !== wallet.toLowerCase()) {
          throw new Error('The signature is not valid.');
        }

        const jobContractQuery = await this.model
          .query('PK')
          .eq(getJobContractKey(jobContractProposal.PK))
          .exec();

        // if contract exist update the signature in it, otherwise create it
        if (jobContractQuery && jobContractQuery.length > 0) {
          const jobContract = jobContractQuery[0] as JobContract;
          jobContract.freelancerSignature.signature = signature;
          await this.model.update(jobContract);
        } else {
          const jobContract: JobContract = {
            PK: getJobContractKey(jobContractProposal.PK).PK,
            SK: getJobContractKey(jobContractProposal.SK).SK,
            createdAt: new Date().toISOString(),
            open: JobContractStatus.None,
            freelancerValidated: true,
            companyValidated: false,
            ...jobContractProposal
          };
          await this.model.create(jobContract);
        }
        return "done";
      }

      // Get Employer signature from request body, verify message -> store in JobContract as employerSignature
      if (jobContractProposal.companyWallet === wallet) {
        const singableMessage = createSignableMessage(jobContractProposal);

        const signerWallet = verifySignature(singableMessage, signature);
        if (signerWallet.toLowerCase() !== wallet.toLowerCase()) {
          throw new Error('The signature is not valid.');
        }

        const jobContractQuery = await this.model
          .query('PK')
          .eq(getJobContractKey(jobContractProposal.PK))
          .exec();

        // if contract exist update the signature in it, otherwise create it
        if (jobContractQuery && jobContractQuery.length > 0) {
          const jobContract = jobContractQuery[0] as JobContract;
          jobContract.companySignature.signature = signature;

          // Store the JobProposal on IPFS and store the CID in the JobContract
          const item = await storeJSONToIPFS(jobContractProposal);
          jobContract.cid = item.message;

          await this.model.update(jobContract);

          const jobProposalSigned = mySignMessage(createSignableMessage(jobContractProposal));

          // Employer get an object in order to create the contract on the blockchain, created by us (employer got at the end the object created and the signed object)
          return {
            cid: item.message,
            jobProposal: jobContractProposal,
            signedJobProposal: jobProposalSigned
          };
          // Employer send the object and the signed object to the blockchain
        } else {
          // Return get job proposal by id and saying that the company need to wait for the freelancer signature/validation
          return {
            jobProposal: jobContractProposal,
            message: 'The company need to wait for the freelancer signature/validation'
          };
        }
      }
      return 'lol';
    } catch (error) {
      console.log('validateJobProposal: ' + error.message);
      throw new UnprocessableEntityException('validateJobProposal: ' + error.message);
    }
  }

  async getJobContractByUUID(uuid: string) {
    const query = await this.model.query('PK').eq(getJobContractKey(uuid)).exec();

    if (!query || query.length === 0) {
      throw new Error('Job contract not found.');
    }

    const jobContract = query[0] as JobContract;
    const cid = await encodeJSONForIPFS(jobContract);
    return { data: jobContract, cid: cid };
  }

  async getUnsignedJobsContract(): Promise<JobContract[]> {
    try {
      const query = await this.model
        .query('openIndex')
        .eq(JobContractStatus.None)
        .where('PK')
        .beginsWith('JobContract#')
        .exec();

      return query.map((jobContract) => {
        return jobContract as JobContract;
      });
    } catch (error) {
      console.log('getUnsignedJobContractByUUID: ' + error.message);
      throw new UnprocessableEntityException('getUnsignedJobContractByUUID: ' + error.message);
    }
  }

  async updateJobContract(jobContract: JobContract) {
    try {
      await this.model.update(jobContract);
    } catch (error) {
      console.log('updateJobContract: ' + error.message);
      throw new UnprocessableEntityException('updateJobContract: ' + error.message);
    }
  }

  async uploadFileSubmission(wallet: string, jobContractId: string, @UploadedFile() file) {
    const s3 = new S3({region: 'us-west-2'});
    const { originalname } = file;
    const extension = originalname.split('.').pop();

    const bucketName = 'wa-submission-files';
    const fileName = `${uuidv4()}#${originalname.split('.')[0]}#${jobContractId}#${wallet}.${extension}`;

    // Calculate SHA-256 hash of file data
    const sha256 = createHash('sha256');
    sha256.update(file.buffer);
    const fileHash = sha256.digest('hex');

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
    };

    try {
      await s3.upload(uploadParams).promise();
    } catch (error) {
      if (error.code === 'NoSuchBucket') {
        // The bucket does not exist, let's create it
        try {
          await s3.createBucket({Bucket: bucketName}).promise();
          console.log(`Bucket ${bucketName} created.`);
          // Now retry the upload
          await s3.upload(uploadParams).promise();
        } catch (err) {
          console.error(`Unable to create bucket: ${bucketName}`);
          throw err;
        }
      } else {
        throw error;
      }
    }

    try {
      const jobFile: JobFile = {
        PK: getJobFileKey(jobContractId).PK,
        SK: getJobFileKey(jobContractId).SK,
        fileHash: fileHash,
        fileName: originalname,
        fileUuid: fileName
      };

      await this.model.create(jobFile);
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException('Unable to create job file.');
    }

    console.log(`File ${fileName} uploaded successfully.`);
  }

  async getJobFile(jobContractId: string): Promise<string> {
    try {
      const s3 = new S3({region: 'us-west-2'});

      const query = await this.model
        .query('PK')
        .eq(getJobFileKey(jobContractId).PK)
        .exec();

      if (!query || query.length === 0) {
        throw new Error('Job file not found.');
      }

      const jobFile = query[0] as JobFile;

      // Generate a pre-signed URL
      const params = {Bucket: 'wa-submission-files', Key: jobFile.fileUuid, Expires: 60 * 5}; // This link will expire in 5 minutes
      const url = s3.getSignedUrl('getObject', params);

      return url;
    } catch (error) {
      console.log('getJobFile: ' + error.message);
      throw new UnprocessableEntityException('getJobFile: ' + error.message);
    }
  }
}
