import { ethers } from "hardhat";
import { MockV3Aggregator } from "packages/solidity/typechain-types";
import { deployTestnetTokens } from "../../scripts/utils/testnet/tokens";
import { PaymentToken, TestContractsType } from "../../scripts/utils/types";
import BigNumber from "bignumber.js";
import { tokensDecimals } from "../../scripts/utils/tokens";

const mockedTokensInfo = [
    {
        token: PaymentToken.Avax,
        price: new BigNumber('0.068'), // 1 AVAX = $14.62 USD -> $1 USD = 0.068 AVAX
    },
    {
        token: PaymentToken.Link,
        price: new BigNumber('0.154'), // 1 LINK = $6.5 USD -> $1 USD = 0.154 LINK
    },
    {
        token: PaymentToken.Wbtc,
        price: new BigNumber('0.00003745'), // 1 BTC = $26700 USD -> $1 USD = 0.00003745 BTC
    }
]

export async function deployMocks() {
    const aggregatorFactory = await ethers.getContractFactory(TestContractsType.MockV3Aggregator);

    // Chainlink aggregators
    const aggregators = new Map<PaymentToken, MockV3Aggregator>();
    for (const { token, price } of mockedTokensInfo) {
        const decimals = tokensDecimals.find(t => t.token === token)!.decimals;
        aggregators.set(token,
            await aggregatorFactory.deploy(decimals, price.times(10 ** decimals).toFixed())
        );
    }

    // Price controllers
    const { link, wbtc } = await deployTestnetTokens();

    return {
        tokensConfig: [
            {
                type: PaymentToken.Avax,
                tokenAddress: '', // Native
                aggregatorAddress: aggregators.get(PaymentToken.Avax)!.address,
            },
            {
                type: PaymentToken.Link,
                tokenAddress: link.address,
                aggregatorAddress: aggregators.get(PaymentToken.Link)!.address,
            },
            {
                type: PaymentToken.Wbtc,
                tokenAddress: wbtc.address,
                aggregatorAddress: aggregators.get(PaymentToken.Wbtc)!.address,
            }
        ]
    };
}
