import { deployMocks } from "../test/utils/deploy";
import { DeployConfig } from "../scripts/utils/types";
import { SIG_AUTHORITY_PV_KEY } from "../test/utils";

export async function deployMocksAndGetConfig(): Promise<DeployConfig> {
    const { tokensConfig } = await deployMocks();
    return {
        sigAuthorityPvKey: SIG_AUTHORITY_PV_KEY,
        authorityFeePct: 7,
        tokensConfig,
    };
}
