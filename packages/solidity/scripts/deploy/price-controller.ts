import { ethers } from 'hardhat';
import { upgrades } from 'hardhat';
import { logger } from '../utils/logger';
import { ContractsType } from '../utils/types';

/*
    npx hardhat run scripts/deploy/price-controller.ts

    Environment variables
        - AVAX_AGGREGATOR
*/

async function main() {
    const factory = await ethers.getContractFactory(ContractsType.PriceController);
    logger.logTitle('Deploying PriceController', [
        'Deployer', await ethers.provider.getSigner().getAddress()
    ]);

    const proxy = await upgrades.deployProxy(
        factory,
        [process.env.AVAX_AGGREGATOR],
        { initializer: 'initialize' }
    );
    logger.logTitle('PriceController', [
        'Proxy address', proxy.address
    ], [
        'Proxy Admin address', await upgrades.erc1967.getAdminAddress(proxy.address)
    ], [
        'Implementation address', await upgrades.erc1967.getImplementationAddress(proxy.address)
    ]);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
