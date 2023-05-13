import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractsType } from "./types";
import { ReputationCard, User } from "../typechain-types";
import { Wallet } from "ethers";

// Types
type UserTestInfo = {
    pubKey: string;
    kycId: string;
};

// Constants
export const KYC_SYSTEM_PV_KEY = '0x113ea374c34d11b617168b48aef9b29997684291a7c318fefb2ea5fff99d1776';
export const KYC_SYSTEM_WALLET = new Wallet(KYC_SYSTEM_PV_KEY);
export const usersInfo: UserTestInfo[] = [
    {
        // user 1
        pubKey: '0xAC688F514468a753894893e5463938896EFF81b4',
        kycId: '0a0a0a0a-1b1b1b1b-2c2c2c2c-3c3c3c3c',
    }, {
        // user 2
        pubKey: '0xf585378ff2A1DeCb335b4899250b83F46DC5c019',
        kycId: '4d4d4d4d-5e5e5e5e-6f6f6f6f-7g7g7g7g',
    }
];

// Methods
export async function deployContract<T>(name: string) {
    const factory = await ethers.getContractFactory(name);
    const contract = await factory.deploy();
    return await contract.deployed() as T;
}

export async function deployBaseContracts() {
    const [addr0, addr1, addr2] = await ethers.getSigners();

    const user = await deployContract<User>("User");
    const reputationCard = await deployContract<ReputationCard>("ReputationCard");
    const employer = await deployContract<Employer>("Employer");
    const contractor = await deployContract<Contractor>("Contractor");
    await user.initialize(KYC_SYSTEM_WALLET.address, reputationCard.address, employer.address, contractor.address);

    // Fixtures can return anything you consider useful for your tests
    return { user, employer, contractor, reputationCard, addr0, addr1, addr2 };
}

export async function verifyUsers(user: User, ...usersInfo: UserTestInfo[]) {
    const result = [];
    for (let i = 0; i < usersInfo.length; i++) {
        const { pubKey, kycId } = usersInfo[i];
        const signature = await signMessage(KYC_SYSTEM_PV_KEY, ['address', pubKey], ['string', kycId]);
        await user.verifyUser(pubKey, kycId, signature);
        result.push({ signature });
    }
    return result;
}

export async function getContractAt<T>(type: ContractsType, address: string) {
    return await ethers.getContractAt(type, address) as T;
}

export async function expectThrowsAsync<T>(asyncFunc: () => Promise<T>, errorMessage: string) {
    let error = null;
    try {
        await asyncFunc();
    }
    catch (err: any) {
        error = err;
    }
    expect(error).to.be.an('Error');
    if (errorMessage) {
        expect(error.message).to.include(errorMessage);
    }
}

export async function printBalances() {
    const accounts: SignerWithAddress[] = await ethers.getSigners()
    accounts.forEach(async (account: SignerWithAddress): Promise<void> => {
        const balance = await ethers.provider.getBalance(account.address);
        console.log(`${account.address} has balance ${ethers.utils.formatEther(balance)}`);
    })
}

export async function signMessage(pvKey: string, ...data: [type: string, value: string][]): Promise<string> {
    const messageHash = ethers.utils.solidityKeccak256(data.map(d => d[0]), data.map(d => d[1]));
    return await new Wallet(pvKey).signMessage(ethers.utils.arrayify(messageHash));
}
