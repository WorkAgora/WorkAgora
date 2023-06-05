import { ethers } from "hardhat";
import { TestContractsType } from "../types";

export async function deployTestnetTokens() {
    const linkFactory = await ethers.getContractFactory(TestContractsType.LinkToken);
    const wbtcFactory = await ethers.getContractFactory(TestContractsType.WrappedBtc);

    // ERC20 Tokens
    const link = await linkFactory.deploy(ethers.utils.parseEther("1000"));
    const wbtc = await wbtcFactory.deploy(ethers.utils.parseEther("1000"));

    return {
        link,
        wbtc,
    };
}
