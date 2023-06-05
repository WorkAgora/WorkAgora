export enum ContractsType {
    UserManager = 'UserManager',
    Contractor = 'Contractor',
    Employer = 'Employer',
    JobContract = 'JobContract',
    PriceController = 'PriceController',
    DisputeSystem = 'DisputeSystem',
}

export enum TestContractsType {
    LinkToken = 'LinkToken',
    WrappedBtc = 'WrappedBtcToken',
    MockV3Aggregator = 'MockV3Aggregator'
}
export type DeployConfig = {
    sigAuthorityPvKey: string;
    authorityFeePct: number;
    tokensConfig: TokenConfig[];
}

export type TokenConfig = {
    type: PaymentToken;
    tokenAddress: string;
    aggregatorAddress: string;
}

export enum PaymentToken {
    // Native
    Avax = 0,
    // ERC20
    Link = 1,
    Wbtc = 2
}
