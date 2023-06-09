import { DeployConfig, PaymentToken } from "../scripts/utils/types";

export async function getConfig(): Promise<DeployConfig> {
    return {
        sigAuthorityPvKey: process.env.BACKEND_PV_KEY!,
        authorityFeePct: 7,
        tokensConfig: [
            // Native
            {
                type: PaymentToken.Avax,
                tokenAddress: '',
                aggregatorAddress: '0x0A77230d17318075983913bC2145DB16C7366156'
            },
            // ERC20s
            {
                type: PaymentToken.Link,
                tokenAddress: '0x5947bb275c521040051d82396192181b413227a3',
                aggregatorAddress: '0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a'
            },
            {
                type: PaymentToken.Wbtc,
                tokenAddress: '0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab',
                aggregatorAddress: '0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743'
            },
            {
                type: PaymentToken.Usdt,
                tokenAddress: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
                aggregatorAddress: '0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a'
            },
        ],
    };
}
