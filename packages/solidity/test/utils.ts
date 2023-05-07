import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export enum ContractsType {
    User = 'User',
    Contractor = 'Contractor',
    Employer = 'Employer',
    ReputationCard = 'ReputationCard',
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
