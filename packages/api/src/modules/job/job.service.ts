import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { CreateJob, JobKey } from './job.interface';
import { CreateJobContractDTO } from '../../dtos/job/job.dto';
import { encodeJSONForIPFS } from '../../../../utils/src/index';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JobService {
  constructor(
    @InjectModel('Job')
    private readonly model: Model<CreateJob, JobKey>
  ) {}


  /**
   * Create a new job contract
   * @param CreateJobDTO The job contract to create
   * @param contractorSignature The contractor's signature
   * @param employerSignature The employer's signature
   * @returns The JobContract Creation on-chain parameters and signatures
   */
  async createJob(
    job: CreateJobContractDTO,
    contractorSignature: string,
    employerSignature: string
  ): Promise<{ JCC: CreateJob; contractorSignature: string; employerSignature: string }> {
    try {
      // Create the job contract metadata (JM)
      const JM = { ...job };

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
      await this.model.create(JCC);

      // Send the JCC and signatures to the user
      return {
        JCC,
        contractorSignature: contractorSignature,
        employerSignature: employerSignature
      };
    } catch (error) {
      throw new UnprocessableEntityException(
        'Error while creating the job contract',
        error.message
      );
    }
  }
}
