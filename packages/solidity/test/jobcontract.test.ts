import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { SIG_AUTHORITY_PV_KEY, UserTestInfo, expectThrowsAsync, getSignersInfo, isTimestampInRange, signMessage } from "./utils";
import { Jcc, Jfc, JobContractState, createJobContract, finalizeJobContract, getOnChainParams } from "./utils/jobContract";
import { verifyUsers } from "./utils/userManager";
import BigNumber from "bignumber.js";
import { Contractor, Employer, JobContract, LinkToken, UserManager } from "../typechain-types";
import { deployAllContracts, getContractAt } from "../scripts/utils/contracts";
import { PaymentToken, TestContractsType, TokenConfig } from "../scripts/utils/types";

const WRONG_SIG_AUTHORITY_PV_KEY = '0x4747474747474747474747474747474747474747474747474747474747474747';
const AVAX_PRICE = new BigNumber('68000000000000000000'); // TODO
const LINK_PRICE = new BigNumber('154000000000000000000');
const AUTHORITY_FEE_PCT = 7;

type JobContractCreateFixtureParams = {
    usersToVerify: UserTestInfo[],
    linkTransfer?: {
        user: UserTestInfo,
        price: BigNumber,
    },
    lnikApproval?: {
        user: UserTestInfo,
        price: BigNumber,
    },
    jcc?: Jcc,
};

describe("Job contracts", () => {

    /**
      For AVAX/USD regtests price see: {@link ./utils/priceController.ts|tokensInfo}
    */
    let baseJcc: Jcc;
    let jccSignature: string;
    let contractorUser: UserTestInfo;
    let employerUser: UserTestInfo;
    let contractor: Contractor;
    let employer: Employer;
    let userManager: UserManager;
    let jobContract: JobContract;
    let link: LinkToken;
    let tokensConfig: TokenConfig[];
    let defaultFixtureCreateParams: JobContractCreateFixtureParams;

    async function initCreateFixture(_params?: Partial<JobContractCreateFixtureParams>) {
        const params = {
            ...defaultFixtureCreateParams,
            ..._params,
        };
        ({ userManager, jobContract, employer, contractor, tokensConfig } = await loadFixture(deployAllContracts));
        link = await getContractAt<LinkToken>(TestContractsType.LinkToken, tokensConfig.find(t => t.type === PaymentToken.Link)!.tokenAddress);
        const { usersToVerify, linkTransfer: linkTransfer, lnikApproval: linkApproval } = params;
        await verifyUsers(userManager, ...usersToVerify);
        if (linkTransfer) {
            await link.transfer(linkTransfer!.user.pubKey, linkTransfer!.price.toFixed());
        }
        if (linkApproval) {
            await link.connect(linkApproval.user.signer).approve(jobContract.address, linkApproval.price.toFixed());
        }
        jccSignature = await signMessage(SIG_AUTHORITY_PV_KEY, ...Object.values(_params?.jcc || baseJcc));
    }

    async function expectBalances(params: { contractBalance: string, employerBalance: string, contractorBalance: string }) {
        expect(await link.balanceOf(jobContract.address)).eq(params.contractBalance);
        expect(await link.balanceOf(employerUser.pubKey)).eq(params.employerBalance);
        expect(await link.balanceOf(contractorUser.pubKey)).eq(params.contractorBalance);
    }

    function getMinTransferApprovalAmount(jcc: Jcc) {
        return LINK_PRICE.times(jcc.initialDepositPct[1] + jcc.lockedAmountPct[1]).div(100);
    }

    function getJccCustomPct(baseJcc: Jcc, percentages: { initialDepositPct: number, lockedAmountPct: number, deferredAmountPct: number }) {
        return getOnChainParams(baseJcc, {
            initialDepositPct: ['uint8', percentages.initialDepositPct],
            lockedAmountPct: ['uint8', percentages.lockedAmountPct],
            deferredAmountPct: ['uint8', percentages.deferredAmountPct]
        });
    }

    before(async () => {
        const signers = await getSignersInfo();
        ({ contractor: contractorUser, employer: employerUser } = signers);
        baseJcc = {
            contractId: ['string', 'contract-id'],
            totalAmountUsd: ['uint128', 1000],
            paymentToken: ['uint8', PaymentToken.Link],
            initialDepositPct: ['uint8', 30],
            lockedAmountPct: ['uint8', 50],
            deferredAmountPct: ['uint8', 20],
            durationDays: ['uint256', 2],
            creationExpiryTimestamp: ['uint256', 4082502246],
            contractorAddress: ['address', contractorUser.pubKey],
            employerAddress: ['address', employerUser.pubKey],
            ipfsJmiHash: ['string', 'bafkreig4eie3hu7bc33omizt5rrb5bnrloewgfrrgdniqbdfoaie5gkdmy'],
        };
        defaultFixtureCreateParams = {
            usersToVerify: [employerUser, contractorUser],
            linkTransfer: { user: employerUser, price: LINK_PRICE },
            lnikApproval: { user: employerUser, price: getMinTransferApprovalAmount(baseJcc) },
        };
    });

    describe("Creation", () => {

        it("Should create a contract", async () => {
            await initCreateFixture();
            expect(await link.balanceOf(jobContract.address)).eq('0');
            expect(await link.balanceOf(employerUser.pubKey)).eq(LINK_PRICE.toFixed());
            expect(await link.balanceOf(contractorUser.pubKey)).eq('0');

            await createJobContract(baseJcc, jccSignature, jobContract);

            // Validate balances
            expect(await link.balanceOf(jobContract.address)).eq('77000000000000000000'); // 50% - locked
            expect(await link.balanceOf(employerUser.pubKey)).eq('30800000000000000000'); // 20% - deferred
            expect(await link.balanceOf(contractorUser.pubKey)).eq('46200000000000000000'); // 30% - initial deposit

            // Validate created contract
            const contract = await jobContract.contracts(baseJcc.contractId[1]);
            expect(contract.length).to.equal(11);
            expect(contract[0]).to.equal(JobContractState.Started);
            expect(contract[1]).to.equal(baseJcc.totalAmountUsd[1]);
            expect(contract[2]).to.equal(LINK_PRICE.toFixed());
            expect(contract[3]).to.equal(baseJcc.lockedAmountPct[1]);
            expect(contract[4]).to.equal(baseJcc.deferredAmountPct[1]);
            expect(contract[5]).to.equal(PaymentToken.Link);
            expect(isTimestampInRange(baseJcc.durationDays[1], contract[6].toNumber())).to.be.true;
            expect(contract[7]).to.equal(baseJcc.contractorAddress[1]);
            expect(contract[8]).to.equal(baseJcc.employerAddress[1]);
            expect(contract[9]).to.equal(baseJcc.ipfsJmiHash[1]);
            expect(contract[10]).to.equal('');

            {
                // Validate contractor info. Contract is stored
                const employerId = await userManager.getEmployerId(employerUser.pubKey);
                const contractorId = await userManager.getContractorId(employerUser.pubKey);
                expect(await employer.contractIds(employerId)).to.equal(baseJcc.contractId[1]);
                expect(await contractor.contractIds(contractorId)).to.equal('');
            }
            {
                // Validate employer info. Contract is stored
                const employerId = await userManager.getEmployerId(contractorUser.pubKey);
                const contractorId = await userManager.getContractorId(contractorUser.pubKey);
                expect(await employer.contractIds(employerId)).to.equal('');
                expect(await contractor.contractIds(contractorId)).to.equal(baseJcc.contractId[1]);
            }
        });

        it("Should fail creation with an existing contractId", async () => {
            await initCreateFixture();
            await createJobContract(baseJcc, jccSignature, jobContract);
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract), 'ContractId already exists');
        });

        it("Should fail creation with an expiry timestamp in the past", async () => {
            const jcc = getOnChainParams(baseJcc, { creationExpiryTimestamp: ['uint256', 1652633694] });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(jcc, jccSignature, jobContract), 'Creation timestamp expired');
        });

        it("Should fail creation when sender is not the employer", async () => {
            await initCreateFixture();
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract, contractorUser.signer), 'Only the employer can create the contract');
        });

        it("Should fail creation when contractor address is the same as employer address", async () => {
            const jcc = getOnChainParams(baseJcc, { contractorAddress: ['address', employerUser.pubKey] });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(jcc, jccSignature, jobContract), 'Invalid C/E addresses');
        });

        it("Should fail creation when contractor is not verified", async () => {
            await initCreateFixture({ usersToVerify: [employerUser] });
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract), 'Unverified contractor');
        });

        it("Should fail creation when employer is not verified", async () => {
            await initCreateFixture({ usersToVerify: [contractorUser] });
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract), 'Unverified employer');
        });

        it("Should fail creation when duration is zero", async () => {
            const jcc = getOnChainParams(baseJcc, { durationDays: ['uint256', 0] });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(jcc, jccSignature, jobContract), 'Duration must be at least 1 day');
        });

        it("Should fail creation when percentages sum is not 100", async () => {
            const jcc = getOnChainParams(baseJcc, {
                initialDepositPct: ['uint8', 30],
                lockedAmountPct: ['uint8', 50],
                deferredAmountPct: ['uint8', 0],
            });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(jcc, jccSignature, jobContract), 'Sum of initialDepositPct, lockedAmountPct and deferredAmountPct must be 100');
        });

        it("Should fail creation when signer isn't sigAuthority", async () => {
            await initCreateFixture();
            const signature = await signMessage(WRONG_SIG_AUTHORITY_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract), 'Invalid signature');
        });

        it("Should fail creation if token transfer allowance is insufficient", async () => {
            await initCreateFixture({ lnikApproval: { user: employerUser, price: getMinTransferApprovalAmount(baseJcc).minus(1) } });
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract), 'ERC20: insufficient allowance');
        });

        it("Should fail creation if token balance is insufficient", async () => {
            await initCreateFixture({ linkTransfer: { user: employerUser, price: LINK_PRICE.minus(1) } });
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract), 'Insufficient balance');
        });

    });

    describe("Finalization", () => {

        let baseJfc: Jfc;
        let baseJfcSignature: string;

        before(async () => {
            baseJfc = {
                contractId: ['string', 'contract-id'],
                ipfsJfiHash: ['string', 'bafkhsrc80ewgfrrgdniqbdfoaie5gkdmyu7bc33omizt5rrb5bnrreig4e'],
            };
            defaultFixtureCreateParams = {
                ...defaultFixtureCreateParams,
                lnikApproval: { user: employerUser, price: LINK_PRICE },
            };
        });

        async function initFinalizationFixture(_params?: Partial<JobContractCreateFixtureParams>) {
            await initCreateFixture(_params);
            await createJobContract(_params?.jcc || baseJcc, jccSignature, jobContract);
            baseJfcSignature = await signMessage(SIG_AUTHORITY_PV_KEY, ...Object.values(baseJfc));
        }

        it("Should finalize a job contract", async () => {
            await initFinalizationFixture();
            await finalizeJobContract(baseJfc, baseJfcSignature, jobContract);

            // Validate finalized contract
            const contract = await jobContract.contracts(baseJfc.contractId[1]);
            expect(contract.state).to.equal(JobContractState.CompleteWithSuccess);
            expect(contract.ipfsJfiHash).to.equal(baseJfc.ipfsJfiHash[1]);

            // Validate balances
            await expectBalances({
                contractBalance: LINK_PRICE.times(AUTHORITY_FEE_PCT).div(100).toFixed(),
                employerBalance: '0',
                contractorBalance: LINK_PRICE.times(100 - AUTHORITY_FEE_PCT).div(100).toFixed()
            });

            {
                // Validate contractor info. Reputation is set
                const employerId = await userManager.getEmployerId(employerUser.pubKey);
                const contractorId = await userManager.getContractorId(employerUser.pubKey);
                expect(await employer.getReputation(employerId)).to.equal(11);
                expect(await contractor.getReputation(contractorId)).to.equal(0);
            }
            {
                // Validate employer info. Reputation is set
                const employerId = await userManager.getEmployerId(contractorUser.pubKey);
                const contractorId = await userManager.getContractorId(contractorUser.pubKey);
                expect(await employer.getReputation(employerId)).to.equal(0);
                expect(await contractor.getReputation(contractorId)).to.equal(11);
            }
        });

        it("Should finalize a job contract with 100% in locked amount", async () => {
            const percentages = { initialDepositPct: 0, lockedAmountPct: 100, deferredAmountPct: 0 };
            const jcc = getJccCustomPct(baseJcc, percentages);
            await initFinalizationFixture({ jcc });

            await expectBalances({
                contractBalance: LINK_PRICE.toFixed(),
                employerBalance: '0',
                contractorBalance: '0'
            });
            await finalizeJobContract(baseJfc, baseJfcSignature, jobContract);
            await expectBalances({
                contractBalance: LINK_PRICE.times(AUTHORITY_FEE_PCT).div(100).toFixed(),
                employerBalance: '0',
                contractorBalance: LINK_PRICE.times(100 - AUTHORITY_FEE_PCT).div(100).toFixed()
            });
        });

        it("Should fail finalization of a job contract that has not started", async () => {
            await initFinalizationFixture();
            const jfc = getOnChainParams(baseJfc, { contractId: ['string', 'contract-id-new'] });
            const signature = await signMessage(SIG_AUTHORITY_PV_KEY, ...Object.values(jfc));
            await expectThrowsAsync(() => finalizeJobContract(jfc, signature, jobContract), 'Invalid contract state');
        });

        it("Should fail finalization when signer isn't sigAuthority", async () => {
            await initFinalizationFixture();
            const signature = await signMessage(WRONG_SIG_AUTHORITY_PV_KEY, ...Object.values(baseJfc));
            await expectThrowsAsync(() => finalizeJobContract(baseJfc, signature, jobContract), 'Invalid signature');
        });

        it("Should fail finalization if deferred token transfer allowance is insufficient", async () => {
            await initFinalizationFixture({ lnikApproval: { user: employerUser, price: getMinTransferApprovalAmount(baseJcc) } });
            await expectThrowsAsync(() => finalizeJobContract(baseJfc, baseJfcSignature, jobContract), 'ERC20: insufficient allowance');
        });

    });
});
