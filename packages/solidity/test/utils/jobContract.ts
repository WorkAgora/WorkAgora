import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JobContract } from "packages/solidity/typechain-types";
import { getSignersInfo, toBlockchainParams } from ".";

export enum JobContractState {
    None,
    Started,
    CompleteWithSuccess,
    OngoingDispute,
    CompleteWithDispute
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

// JobContractFinalizationParams
export type Jfc = {
    contractId: [string, string],
    ipfsJfiHash: [string, string],
};

export function getOnChainParams<T extends Jcc | Jfc>(params: T, newParams: Partial<T>): T {
    const edited: T = { ...params };
    for (let key in newParams) {
        if (newParams[key] !== undefined) {
            // @ts-ignore
            edited[key] = newParams[key];
        }
    }
    return edited;
}

export async function createJobContract(jcc: Jcc, signature: string, jobContract: JobContract, sender?: SignerWithAddress) {
    let deployer: SignerWithAddress;
    if(sender) {
        deployer = sender;
    } else {
        deployer = (await getSignersInfo()).employer.signer;
    }
    const params = toBlockchainParams<JobContract.CreateParamsStruct>(jcc);
    await jobContract.connect(deployer).create(params, signature);
}

export async function finalizeJobContract(jfc: Jfc, signature: string, jobContract: JobContract, sender?: SignerWithAddress) {
    let deployer: SignerWithAddress;
    if(sender) {
        deployer = sender;
    } else {
        deployer = (await getSignersInfo()).employer.signer;
    }
    const params = toBlockchainParams<JobContract.FinalizationParamsStruct>(jfc);
    await jobContract.connect(deployer).finalize(params, signature);
}

