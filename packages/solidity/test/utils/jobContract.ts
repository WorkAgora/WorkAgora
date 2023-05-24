import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JobContract } from "packages/solidity/typechain-types";
import { getSignersInfo, toBlockchainParams } from ".";

export enum JobContractState {
    Started,
    CompleteWithSuccess,
    OngoingDispute,
    CompleteWithDispute
}

// JobContractMetadata
export type Jcm = {
    guid: string,
    price: number,
    description: string,
    employerWallet: string,
    contractorWallet: string,
    // add more fields...
}

// JobContractCreateParams
export type Jcc = {
    contractId: [string, string],
    totalAmountUsd: [string, number],
    paymentToken: [string, number],
    initialDepositPct: [string, number],
    lockedAmountPct: [string, number],
    deferredAmountPct: [string, number],
    durationDays: [string, number],
    creationExpiryTimestamp: [string, number],
    contractorAddress: [string, string],
    employerAddress: [string, string],
    ipfsJmiHash: [string, string],
};

export function getJcc(baseJcc: Jcc, newParams: Partial<Jcc>): Jcc {
    const editedJcc: Jcc = { ...baseJcc };
    for (let key in newParams) {
        // @ts-ignore
        editedJcc[key] = newParams[key];
    }
    return editedJcc;
}

export async function createJobContract(jcc: Jcc, signature: string, jobContract: JobContract, sender?: SignerWithAddress) {
    let deployer: SignerWithAddress;
    if(sender) {
        deployer = sender;
    } else {
        deployer = (await getSignersInfo()).employer.signer;
    }
    const params = toBlockchainParams(jcc);
    await jobContract.connect(deployer).create(params, signature);
}
