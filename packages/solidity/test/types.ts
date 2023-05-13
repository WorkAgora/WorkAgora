type address = string;

export type JobContractMetadata = { // JM
    guid: string,
    price: number,
    description: string,
    employerWallet: address,
    contractorWallet: address,
    // add more fields...
}

export enum ContractsType {
    User = 'User',
    Contractor = 'Contractor',
    Employer = 'Employer',
    ReputationCard = 'ReputationCard',
}

// User
export enum Role {
    Employer = 0,
    Contractor = 1
}
