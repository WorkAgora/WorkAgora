import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JobContract } from "packages/solidity/typechain-types";

export enum JobContractState {
    Started,
    CompleteWithSuccess,
    OngoingDispute,
    CompleteWithDispute
}

// JM
export type JobContractMetadata = {
    guid: string,
    price: number,
    description: string,
    employerWallet: string,
    contractorWallet: string,
    // add more fields...
}

export type Jcc = {
    contractId: [string, number],
    priceUsd: [string, number],
    durationDays: [string, number],
    creationExpiryTimestamp: [string, number],
    contractorAddress: [string, string],
    employerAddress: [string, string],
    ipfsJmiHash: [string, string],
};

export function getJcc(baseJcc: Jcc, newParams: Partial<Jcc>): Jcc {
    const editedJcc: Jcc = { ...baseJcc };

    // Overwrite the fields with the new values
    for (let key in newParams) {
        // @ts-ignore
        editedJcc[key] = newParams[key];
    }

    return editedJcc;
}

export async function createJobContract(jcc: Jcc, signature: string, jobContract: JobContract, sender?: SignerWithAddress) {
    const contract = sender ? jobContract.connect(sender) : jobContract;
    await contract.create(
        jcc.contractId[1],
        jcc.priceUsd[1],
        jcc.durationDays[1],
        jcc.creationExpiryTimestamp[1],
        jcc.contractorAddress[1],
        jcc.employerAddress[1],
        jcc.ipfsJmiHash[1],
        signature);
}
