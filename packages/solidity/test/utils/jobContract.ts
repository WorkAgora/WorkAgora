import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JobContract } from "packages/solidity/typechain-types";
import { getSignersInfo, getTxFee, toBlockchainParams } from ".";
import BigNumber from "bignumber.js";

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

export type CreateJobContractParams = {
    jcc: Jcc,
    signature: string,
    jobContract: JobContract,
    sender?: SignerWithAddress,
    wei?: BigNumber,
};

export async function createJobContract(defaultParams: CreateJobContractParams, overrides?: Partial<CreateJobContractParams>) {
    const { jcc, signature, jobContract, sender, wei } = {
        ...defaultParams,
        ...overrides,
    };
    let deployer: SignerWithAddress;
    if (sender) {
        deployer = sender;
    } else {
        deployer = (await getSignersInfo()).employer.signer;
    }
    const jobContractReady = jobContract.connect(deployer);
    const params = toBlockchainParams<JobContract.CreateParamsStruct>(jcc);
    const tx = wei ? await jobContractReady.create(params, signature, { value: wei.toFixed() })
        : await jobContractReady.create(params, signature);
    return {
        txFee: await getTxFee(tx, await tx.wait()),
    };
}

export type FinalizeJobContractParams = {
    jfc: Jfc,
    signature: string,
    jobContract: JobContract,
    sender?: SignerWithAddress,
    wei?: BigNumber,
};

export async function finalizeJobContract(defaultParams: FinalizeJobContractParams, overrides?: Partial<FinalizeJobContractParams>) {
    const { jfc, signature, jobContract, sender, wei } = {
        ...defaultParams,
        ...overrides,
    };
    let deployer: SignerWithAddress;
    if (sender) {
        deployer = sender;
    } else {
        deployer = (await getSignersInfo()).employer.signer;
    }
    const jobContractReady = jobContract.connect(deployer);
    const params = toBlockchainParams<JobContract.FinalizationParamsStruct>(jfc);
    const tx = wei ? await jobContractReady.finalize(params, signature, { value: wei.toFixed() })
        : await jobContractReady.finalize(params, signature);
    return {
        txFee: await getTxFee(tx, await tx.wait()),
    };
}

