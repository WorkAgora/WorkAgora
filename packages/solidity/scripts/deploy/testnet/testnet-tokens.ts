import { ethers } from "hardhat";
import { logger } from "../../utils/logger";
import { deployTestnetTokens } from "../../utils/testnet/tokens";
import { TestContractsType } from "../../utils/types";

/*
    npx hardhat run scripts/deploy/testnet/testnet-tokens.ts
*/

async function deployTokens() {
    logger.logTitle('Deploying Testnet Tokens', [
        'Deployer', await ethers.provider.getSigner().getAddress()
    ]);
    const { link, wbtc } = await deployTestnetTokens();
    logger.logTitle('Contracts deployed',
        [TestContractsType.LinkToken, link.address],
        [TestContractsType.WrappedBtc, wbtc.address],
    );
}

deployTokens().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
