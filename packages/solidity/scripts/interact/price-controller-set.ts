import { ContractsType } from '../utils/types';
import { getContractAt } from '../utils/contracts';
import { PriceController } from 'packages/solidity/typechain-types';
import { logger } from '../utils/logger';
import { sleep } from '../utils/helper';
import { logTokenData } from './price-controller-get';

/*
    npx hardhat run scripts/interact/price-controller-set.ts

    Environment variables
        - PRICE_CONTROLLER_PROXY
        - PAYMENT_TOKEN
        - AGGREGATOR
        - TOKEN_ADDRESS
*/

async function main() {
    const priceController = await getContractAt<PriceController>(
        ContractsType.PriceController,
        process.env.PRICE_CONTROLLER_PROXY!
    );

    await priceController.setToken(
        process.env.PAYMENT_TOKEN!,
        process.env.AGGREGATOR!,
        process.env.TOKEN_ADDRESS!,
    );

    // Wait a bit
    await sleep(10 * 1000);

    await logTokenData(priceController, process.env.PAYMENT_TOKEN!);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
