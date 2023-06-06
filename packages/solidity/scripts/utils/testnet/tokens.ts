import { ethers } from "hardhat";
import { PaymentToken, TestContractsType } from "../types";
import BigNumber from "bignumber.js";
import { tokensDecimals } from "../tokens";

export async function deployTestnetTokens() {
    const linkFactory = await ethers.getContractFactory(TestContractsType.LinkToken);
    const wbtcFactory = await ethers.getContractFactory(TestContractsType.WrappedBtc);

    // ERC20 Tokens
    const link = await linkFactory.deploy(new BigNumber("1000").times(10 ** tokensDecimals.find(t => t.token === PaymentToken.Link)!.decimals).toFixed());
    const wbtc = await wbtcFactory.deploy(new BigNumber("1000").times(10 ** tokensDecimals.find(t => t.token === PaymentToken.Wbtc)!.decimals).toFixed());

    return {
        link,
        wbtc,
    };
}
