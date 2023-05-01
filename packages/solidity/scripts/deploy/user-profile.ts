import { ethers } from 'hardhat';
import { upgrades } from 'hardhat';
import { logger } from '../utils/logger';

async function main() {
    const factory = await ethers.getContractFactory('UserProfile');
    logger.logInfo('Deploying UserProfile');
    const proxy = await upgrades.deployProxy(factory, [], { initializer: undefined });
    logger.logInfoTitle('UserProfile', [
        'Proxy address', proxy.address
    ], [
        'Proxy Admin address', await upgrades.erc1967.getAdminAddress(proxy.address)
    ], [
        'Implementation address',  await upgrades.erc1967.getImplementationAddress(proxy.address)
    ])
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
