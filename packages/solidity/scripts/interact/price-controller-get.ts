import { ContractsType } from '../utils/types';
import { getContractAt } from '../utils/contracts';
import { PriceController } from 'packages/solidity/typechain-types';
import { logger } from '../utils/logger';
import { BigNumberish } from 'ethers';
import BigNumber from 'bignumber.js';

/*
    npx hardhat run scripts/interact/price-controller-get.ts

    Environment variables
        - PRICE_CONTROLLER_PROXY
        - PAYMENT_TOKEN
*/

async function main() {
    const priceController = await getContractAt<PriceController>(
        ContractsType.PriceController,
        process.env.PRICE_CONTROLLER_PROXY!
    );

    await logTokenData(priceController, process.env.PAYMENT_TOKEN!);
}

export async function logTokenData(priceController: PriceController, paymentToken: BigNumberish) {
    const price = await priceController.getTokenPriceFromUsd(paymentToken, 1);
    logger.logTitle('Data',
        ['IsSet', (await priceController.isTokenSet(paymentToken)).toString()],
        ['TokenData', (await priceController.getTokenData(paymentToken)).toString()],
        ['PriceUsd', `$${new BigNumber(price[0].toString()).div(10 ** price[1]).toFixed()}`]
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
