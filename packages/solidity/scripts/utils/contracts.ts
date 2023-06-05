import { ethers } from "hardhat";
import { Contractor, DisputeSystem, Employer, JobContract, PriceController, UserManager } from "packages/solidity/typechain-types";
import { getDeployConfig } from "../utils/configs";
import { logger } from "../utils/logger";
import { ContractsType, PaymentToken } from "./types";

export async function deployContract<T>(name: string) {
    const factory = await ethers.getContractFactory(name);
    const contract = await factory.deploy();
    return await contract.deployed() as T;
}

// Deploy function shared between test, dev, prod env
export async function deployAllContracts() {
    const [deployer] = await ethers.getSigners();
    const { chainId } = await ethers.provider.getNetwork();
    const config = await getDeployConfig(chainId);
    logger.log('Deploying all contracts');

    const sigAuthorityWallet = new ethers.Wallet(config.sigAuthorityPvKey);
    const userManager = await deployContract<UserManager>(ContractsType.UserManager);
    const employer = await deployContract<Employer>(ContractsType.Employer);
    const contractor = await deployContract<Contractor>(ContractsType.Contractor);
    const jobContract = await deployContract<JobContract>(ContractsType.JobContract);
    const priceController = await deployContract<PriceController>(ContractsType.PriceController);
    const disputeSystem = await deployContract<DisputeSystem>(ContractsType.DisputeSystem);

    // Init
    await userManager.initialize(sigAuthorityWallet.address,
        employer.address,
        contractor.address,
        jobContract.address
    );
    await jobContract.initialize(userManager.address, priceController.address, employer.address, contractor.address, disputeSystem.address, config.authorityFeePct);
    await employer.initialize(jobContract.address);
    await contractor.initialize(jobContract.address);
    await priceController.initialize(config.tokensConfig.find(t => t.type === PaymentToken.Avax)!.aggregatorAddress);

    // Set ERC20 tokens
    for (const token of config.tokensConfig.filter(t => t.type !== PaymentToken.Avax)) {
        await priceController.setToken(token.type, token.aggregatorAddress, token.tokenAddress);
    }
    
    logger.logTitle('Contracts deployed',
        [ContractsType.UserManager, userManager.address],
        [ContractsType.Employer, employer.address],
        [ContractsType.Contractor, contractor.address],
        [ContractsType.JobContract, jobContract.address],
        [ContractsType.PriceController, priceController.address],
        [ContractsType.DisputeSystem, disputeSystem.address]
    );
    logger.logTitle('Contracts initialized',
        [ContractsType.UserManager, userManager.address],
        [ContractsType.Employer, employer.address],
        [ContractsType.Contractor, contractor.address],
        [ContractsType.JobContract, jobContract.address],
    );
    logger.logTitle('Token configs',
        ...config.tokensConfig.map(t => [t.type.toString(), t.tokenAddress] as [string, string]),
    );
    logger.log("Account balance:", (await deployer.getBalance()).toString());

    return {
        userManager,
        employer,
        contractor,
        jobContract,
        priceController,
        tokensConfig: config.tokensConfig,
    };
}

export async function getContractAt<T>(type: ContractsType | string, address: string) {
    return await ethers.getContractAt(type, address) as T;
}
