import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ethers } from 'ethers';
import { JobContractService } from '../job-contract/jobContract.service';
import { JobContractStatus } from '../job-contract/job-contract.interface';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private readonly provider;
  private contract;
  private readonly contractAddress = process.env.CONTRACT_ADDRESS;
  private readonly contractABI = [
    // Replace with your contract ABI
    //...
  ];

  constructor(
    private readonly jobContractService: JobContractService,
    private readonly notificationService: NotificationService
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.provider);
  }

  /**
   * Cron that check (based on the PK) if a contract is created on the blockchain.
   * If yes, update the jobContract with the contract address
   * @returns
   */
  @Cron('*/10 * * * *') // runs every 10 mins
  async detectDeployedJobContract() {
    const queryJobContract = await this.jobContractService.getUnsignedJobsContract();

    queryJobContract.forEach(async (jobContract) => {
      try {
        const contractData = await this.contract.contracts(jobContract.PK);
        if (contractData.contractId === jobContract.PK) {
          this.logger.log(`JobContract with id ${jobContract.PK} exists in the contract.`);
          jobContract.open = JobContractStatus.Started;
          await this.jobContractService.updateJobContract(jobContract);
        } else {
          this.logger.log(`JobContract with id ${jobContract.PK} does not exist in the contract.`);
        }
      } catch (error) {
        this.logger.error(`Error checking JobContract: ${error.message}`);
      }
    });
  }
}
