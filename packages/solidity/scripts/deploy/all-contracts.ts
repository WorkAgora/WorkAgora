import { ethers } from "hardhat";
import { deployAllContracts } from "../utils/contracts";
import { logger } from "../utils/logger";

/*
    npx hardhat run scripts/deploy/all-contracts.ts
*/

async function main() {
    const deployer = await ethers.provider.getSigner().getAddress();
    const startBalance = await ethers.provider.getBalance(deployer);
    await deployAllContracts();
    const endBalance = await ethers.provider.getBalance(deployer);

    logger.logTitle('Balance',
        ['AAVE spent', ethers.utils.formatEther(startBalance.sub(endBalance))],
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
