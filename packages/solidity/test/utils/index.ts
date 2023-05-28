import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JobContract, MockV3Aggregator, PriceController, ReputationCard, UserManager } from "../../typechain-types";
import { Wallet } from "ethers";
import { Jcc, Jfc } from "./jobContract";
import { PaymentToken, tokensInfo } from "./priceController";
import { strict as assert } from "assert";

// Constants
export const SIG_AUTHORITY_PV_KEY = '0x113ea374c34d11b617168b48aef9b29997684291a7c318fefb2ea5fff99d1776';
export const SIG_AUTHORITY_WALLET = new Wallet(SIG_AUTHORITY_PV_KEY);

// Types
export type UserTestInfo = {
    signer: SignerWithAddress;
    pubKey: string;
    kycId: string;
};

export enum ContractsType {
    UserManager = 'UserManager',
    Contractor = 'Contractor',
    Employer = 'Employer',
    ReputationCard = 'ReputationCard',
    JobContract = 'JobContract',
    PriceController = 'PriceController',
    // Tests contracts below
    WrappedAvaxToken = 'WrappedAvaxToken',
    LinkToken = 'LinkToken',
    MockV3Aggregator = 'MockV3Aggregator'
}

// Methods
export async function deployContract<T>(name: string) {
    const factory = await ethers.getContractFactory(name);
    const contract = await factory.deploy();
    return await contract.deployed() as T;
}

export async function deployBaseContracts() {
    const wavaxFactory = await ethers.getContractFactory(ContractsType.WrappedAvaxToken);
    const linkFactory = await ethers.getContractFactory(ContractsType.LinkToken);
    const aggregatorFactory = await ethers.getContractFactory(ContractsType.MockV3Aggregator);

    // ERC20 Tokens
    const wavax = await wavaxFactory.deploy(ethers.utils.parseEther("1000"));
    const link = await linkFactory.deploy(ethers.utils.parseEther("1000"));

    // Chainlink aggregators
    const aggregators = new Map<PaymentToken, MockV3Aggregator>();
    for (const { token, decimals, price } of tokensInfo) {
        aggregators.set(token,
            await aggregatorFactory.deploy(decimals, price.times(10 ** decimals).toFixed())
        );
    }

    const userManager = await deployContract<UserManager>(ContractsType.UserManager);
    const reputationCard = await deployContract<ReputationCard>(ContractsType.ReputationCard);
    const employer = await deployContract<Employer>(ContractsType.Employer);
    const contractor = await deployContract<Contractor>(ContractsType.Contractor);
    const jobContract = await deployContract<JobContract>(ContractsType.JobContract);
    const priceController = await deployContract<PriceController>(ContractsType.PriceController);

    // Init
    await userManager.initialize(SIG_AUTHORITY_WALLET.address,
        reputationCard.address,
        employer.address,
        contractor.address,
        jobContract.address
    );
    await jobContract.initialize(userManager.address, priceController.address);
    await priceController.setToken(PaymentToken.Avax, aggregators.get(PaymentToken.Avax)!.address, wavax.address);
    await priceController.setToken(PaymentToken.Link, aggregators.get(PaymentToken.Link)!.address, link.address);

    return {
        userManager,
        employer,
        contractor,
        reputationCard,
        jobContract,
        priceController,
        wavax,
        link,
    };
}

export async function getContractAt<T>(type: ContractsType, address: string) {
    return await ethers.getContractAt(type, address) as T;
}

export async function getSignersInfo() {
    const signers = await ethers.getSigners();
    const signersInfo = {
        deployer: {
            signer: signers[0],
            pubKey: '0xAC688F514468a753894893e5463938896EFF81b4',
            kycId: '4d4d4d4d-5e5e5e5e-6f6f6f6f-7g7g7g7g',
        },
        employer: {
            signer: signers[1],
            pubKey: '0xf585378ff2A1DeCb335b4899250b83F46DC5c019',
            kycId: '0a0a0a0a-5e5e5e5e-2c2c2c2c-3c3c3c3c',
        },
        contractor: {
            signer: signers[2],
            pubKey: '0x9b9a98D4cDF5718b1A0791878cE32a3bEb229AAC',
            kycId: '0a0a0a0a-1b1b1b1b-2c2c2c2c-3c3c3c3c',
        }
    };
    assert(Object.values(signersInfo).every(s => s.signer.address === s.pubKey), `Invalid signers`); // safe check
    return signersInfo;
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
    if (errorMessage && !error?.message.includes(errorMessage)) {
        const errMsg = `Error message should include '${errorMessage}', error=${error}`;
        if (error) {
            error.message = `${errMsg} ${error.message}`;
            throw error;
        }
        throw new Error(errMsg)
    }
}

export async function printBalances() {
    const accounts: SignerWithAddress[] = await ethers.getSigners()
    accounts.forEach(async (account: SignerWithAddress): Promise<void> => {
        const balance = await ethers.provider.getBalance(account.address);
        console.log(`${account.address} has balance ${ethers.utils.formatEther(balance)}`);
    })
}

export async function signMessage(pvKey: string, ...data: [type: string, value: any][]): Promise<string> {
    const messageHash = ethers.utils.solidityKeccak256(data.map(d => d[0]), data.map(d => d[1]));
    return await new Wallet(pvKey).signMessage(ethers.utils.arrayify(messageHash));
}

export function toBlockchainParams<T>(data: Jcc | Jfc) {
    const result = {};
    for (const key in data) {
        // @ts-ignore
        result[key] = data[key][1];
    }
    return result as T;
}
