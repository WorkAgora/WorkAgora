import { ethers, upgrades } from "hardhat";
import { Contractor, Employer, JobContract, PriceController, UserManager } from "packages/solidity/typechain-types";
import { getDeployConfig } from "../utils/configs";
import { logger } from "../utils/logger";
import { ContractsType, PaymentToken } from "./types";
import { ContractTransaction } from "ethers";

export async function deployContractProxy<T>(name: string) {
    const [deployer] = await ethers.getSigners();
    const factory = await ethers.getContractFactory(name);
    const proxy = await upgrades.deployProxy(factory, [deployer.address], { initializer: 'setOwner' });
    await proxy.deployed();
    try {
        logger.logTitle(name, [
            'Proxy address', proxy.address
        ], [
            'Proxy Admin address', await upgrades.erc1967.getAdminAddress(proxy.address)
        ], [
            'Implementation address', await upgrades.erc1967.getImplementationAddress(proxy.address)
        ]);
    } catch (error) {
        logger.logTitle(name, [
            'Proxy address', proxy.address
        ], [
            'Getting admin/implementation addresses failed', `${error}`
        ]);
    }
    return proxy as T;
}

// Deploy function shared between test, dev, prod env
export async function deployAllContracts() {
    const [deployer] = await ethers.getSigners();
    const { chainId } = await ethers.provider.getNetwork();
    const config = await getDeployConfig(chainId);
    logger.log('Deploying all contracts');

    const sigAuthorityWallet = new ethers.Wallet(config.sigAuthorityPvKey);
    const userManager = await deployContractProxy<UserManager>(ContractsType.UserManager);
    const employer = await deployContractProxy<Employer>(ContractsType.Employer);
    const contractor = await deployContractProxy<Contractor>(ContractsType.Contractor);
    const jobContract = await deployContractProxy<JobContract>(ContractsType.JobContract);
    const priceController = await deployContractProxy<PriceController>(ContractsType.PriceController);
    // const disputeSystem = await deployContractProxy<DisputeSystem>(ContractsType.DisputeSystem);

    // Initialize
    await waitForTx(await userManager.initialize(
        sigAuthorityWallet.address,
        employer.address,
        contractor.address,
        jobContract.address
    ));
    await waitForTx(await jobContract.initialize(userManager.address, priceController.address, employer.address, contractor.address, '0x0000000000000000000000000000000000000000', config.authorityFeePct));
    await waitForTx(await employer.initialize(jobContract.address));
    await waitForTx(await contractor.initialize(jobContract.address));
    await waitForTx(await priceController.initialize(config.tokensConfig.find(t => t.type === PaymentToken.Avax)!.aggregatorAddress));

    // Set ERC20 tokens
    for (const token of config.tokensConfig.filter(t => t.type !== PaymentToken.Avax)) {
        await waitForTx(await priceController.setToken(token.type, token.aggregatorAddress, token.tokenAddress));
    }

    logger.logTitle('Contracts deployed',
        [ContractsType.UserManager, userManager.address],
        [ContractsType.Employer, employer.address],
        [ContractsType.Contractor, contractor.address],
        [ContractsType.JobContract, jobContract.address],
        [ContractsType.PriceController, priceController.address],
        // [ContractsType.DisputeSystem, disputeSystem.address]
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

export async function waitForTx(tx: ContractTransaction) {
    await tx.wait();
}

export async function getContractAt<T>(type: ContractsType | string, address: string) {
    return await ethers.getContractAt(type, address) as T;
}
