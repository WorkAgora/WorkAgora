import * as localConfig from "../../configs/local";
import * as testnetConfig from "../../configs/testnet";
import * as mainnetConfig from "../../configs/mainnet";
import hardhatConfig from "../../hardhat.config";
import { DeployConfig } from "./types";

/*
export type PaymentToken = 'Avax' | 'Link';
export type TokenType = 'native' | 'erc20';

export const SupportedTokens: Record<PaymentToken, {
    type: TokenType,
    index: number,
}> = {
    "Avax": {
        type: "native",
        index: 0
    },
    "Link": "erc20"
}
*/

export async function getDeployConfig(chainId: number): Promise<DeployConfig> {
    const { hardhat, testnet, mainnet } = hardhatConfig.networks!;
    if (chainId === hardhat!.chainId) {
        return localConfig.deployMocksAndGetConfig();
    }
    if (chainId === testnet!.chainId) {
        return testnetConfig.deployTokensAndGetConfig();
    }
    if (chainId === mainnet!.chainId) {
        return mainnetConfig.getConfig();
    }
    throw new Error(`Unsupported chainId=${chainId}`);
}
