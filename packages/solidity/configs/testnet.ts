import { deployTestnetTokens } from "../scripts/utils/testnet/tokens";
import { DeployConfig, PaymentToken } from "../scripts/utils/types";

export async function deployTokensAndGetConfig(): Promise<DeployConfig> {
    const { link, wbtc } = await deployTestnetTokens();
    return {
        sigAuthorityPvKey: process.env.BACKEND_PV_KEY!,
        authorityFeePct: 7,
        tokensConfig: [
            // Native
            {
                type: PaymentToken.Avax,
                tokenAddress: '',
                aggregatorAddress: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD'
            },
            // ERC20s
            {
                type: PaymentToken.Link,
                tokenAddress: link.address,
                aggregatorAddress: '0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470'
            },
            {
                type: PaymentToken.Wbtc,
                tokenAddress: wbtc.address,
                aggregatorAddress: '0x31CF013A08c6Ac228C94551d535d5BAfE19c602a'
            },
        ],
    };
}
