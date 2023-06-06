import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { SIG_AUTHORITY_PV_KEY, UserTestInfo, expectThrowsAsync, getNativeBalance, getSignersInfo, isTimestampInRange, signMessage } from "./utils";
import { CreateJobContractParams, FinalizeJobContractParams, Jcc, Jfc, JobContractState, createJobContract, finalizeJobContract, getOnChainParams } from "./utils/jobContract";
import { verifyUsers } from "./utils/userManager";
import BigNumber from "bignumber.js";
import { Contractor, Employer, JobContract, LinkToken, UserManager } from "../typechain-types";
import { deployAllContracts, getContractAt } from "../scripts/utils/contracts";
import { PaymentToken, TestContractsType, TokenConfig } from "../scripts/utils/types";
import { ethers } from "hardhat";
import { TEST_INIT_AMOUNT } from "../hardhat.config";

const WRONG_SIG_AUTHORITY_PV_KEY = '0x4747474747474747474747474747474747474747474747474747474747474747';
const AVAX_PRICE = new BigNumber('68000000000000000000');
const LINK_PRICE = new BigNumber('154000000000000000000');
const AUTHORITY_FEE_PCT = 7;

type JobContractCreateFixtureParams = {
    usersToVerify: UserTestInfo[],
    transfer?: {
        token: PaymentToken,
        user: UserTestInfo,
        price: BigNumber,
    },
    linkApproval?: {
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
    let defaultCreateJobContractParams: CreateJobContractParams;

    async function initCreateFixture(params?: Partial<JobContractCreateFixtureParams>) {
        const { usersToVerify, transfer, linkApproval } = {
            ...defaultFixtureCreateParams,
            ...params,
        };
        const jcc = params?.jcc || baseJcc;
        ({ userManager, jobContract, employer, contractor, tokensConfig } = await loadFixture(deployAllContracts));
        link = await getContractAt<LinkToken>(TestContractsType.LinkToken, tokensConfig.find(t => t.type === PaymentToken.Link)!.tokenAddress);
        await verifyUsers(userManager, ...usersToVerify);
        if (transfer) {
            if (transfer.token === PaymentToken.Avax) {
                await ethers.provider.getSigner().sendTransaction({ to: transfer.user!.pubKey, value: transfer!.price.toFixed() });
            } else if (transfer.token === PaymentToken.Link) {
                await link.transfer(transfer!.user.pubKey, transfer!.price.toFixed());
            } else {
                throw new Error('Unsupported token');
            }
        }
        if (linkApproval) {
            await link.connect(linkApproval.user.signer).approve(jobContract.address, linkApproval.price.toFixed());
        }
        jccSignature = await signMessage(SIG_AUTHORITY_PV_KEY, ...Object.values(jcc));
        defaultCreateJobContractParams = {
            jcc,
            signature: jccSignature,
            jobContract,
            wei: AVAX_PRICE.times(jcc.initialDepositPct[1]).plus(AVAX_PRICE.times(jcc.lockedAmountPct[1])).div(100)
        };
        return {
            jcc,
        };
    }

    async function initCreateFixtureERC20(params?: Partial<JobContractCreateFixtureParams>) {
        const { jcc } = await initCreateFixture({
            jcc: getOnChainParams(baseJcc, { paymentToken: ['uint8', PaymentToken.Link] }),
            transfer: { token: PaymentToken.Link, user: employerUser, price: LINK_PRICE },
            linkApproval: { user: employerUser, price: getMinTransferApprovalAmount(baseJcc) },
            ...params,
        });
        defaultCreateJobContractParams = {
            ...defaultCreateJobContractParams,
            wei: undefined,
        };
        return {
            jcc,
        };
    }

    function getMinTransferApprovalAmount(jcc: Jcc) {
        return LINK_PRICE.times(jcc.initialDepositPct[1] + jcc.lockedAmountPct[1]).div(100);
    }

    before(async () => {
        const signers = await getSignersInfo();
        ({ contractor: contractorUser, employer: employerUser } = signers);
        baseJcc = {
            contractId: ['string', 'contract-id'],
            totalAmountUsd: ['uint128', 1000],
            paymentToken: ['uint8', PaymentToken.Avax],
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
            transfer: { token: PaymentToken.Avax, user: employerUser, price: AVAX_PRICE },
        };
    });

    describe("Creation", () => {

        it("Should create a contract paying with the native token", async () => {
            await initCreateFixture();
            expect(await getNativeBalance(jobContract.address)).eq('0');
            expect((await getNativeBalance(employerUser.pubKey)).sub(TEST_INIT_AMOUNT)).eq('68000000000000000000');
            expect((await getNativeBalance(contractorUser.pubKey)).sub(TEST_INIT_AMOUNT)).eq('0');

            const { txFee } = await createJobContract(defaultCreateJobContractParams);

            // Validate balances
            expect(await getNativeBalance(jobContract.address)).eq('34000000000000000000'); // 50% - locked
            expect((await getNativeBalance(employerUser.pubKey)).sub(TEST_INIT_AMOUNT).add(txFee)).eq('13600000000000000000'); // 20% - deferred
            expect((await getNativeBalance(contractorUser.pubKey)).sub(TEST_INIT_AMOUNT)).eq('20400000000000000000'); // 30% - initial deposit

            // Validate created contract
            const contract = await jobContract.contracts(baseJcc.contractId[1]);
            expect(contract.length).to.equal(11);
            expect(contract[0]).to.equal(JobContractState.Started);
            expect(contract[1]).to.equal(baseJcc.totalAmountUsd[1]);
            expect(contract[2]).to.equal(AVAX_PRICE.toFixed());
            expect(contract[3]).to.equal(baseJcc.lockedAmountPct[1]);
            expect(contract[4]).to.equal(baseJcc.deferredAmountPct[1]);
            expect(contract[5]).to.equal(PaymentToken.Avax);
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

        it("Should create a contract paying with an ERC20", async () => {
            await initCreateFixtureERC20();
            expect(await link.balanceOf(jobContract.address)).eq('0');
            expect(await link.balanceOf(employerUser.pubKey)).eq(LINK_PRICE.toFixed());
            expect(await link.balanceOf(contractorUser.pubKey)).eq('0');

            await createJobContract(defaultCreateJobContractParams);

            // Validate balances
            expect(await link.balanceOf(jobContract.address)).eq('77000000000000000000'); // 50% - locked
            expect(await link.balanceOf(employerUser.pubKey)).eq('30800000000000000000'); // 20% - deferred
            expect(await link.balanceOf(contractorUser.pubKey)).eq('46200000000000000000'); // 30% - initial deposit

            // Validate created contract
            const contract = await jobContract.contracts(baseJcc.contractId[1]);
            expect(contract.state).to.equal(JobContractState.Started);
            expect(contract.totalAmountToken).to.equal(LINK_PRICE.toFixed());
            expect(contract.paymentToken).to.equal(PaymentToken.Link);
        });

        it("Should fail creation with an existing contractId", async () => {
            await initCreateFixture();
            await createJobContract(defaultCreateJobContractParams);
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams), 'ContractId already exists');
        });

        it("Should fail creation with an expiry timestamp in the past", async () => {
            const jcc = getOnChainParams(baseJcc, { creationExpiryTimestamp: ['uint256', 1652633694] });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams, { jcc }), 'Creation timestamp expired');
        });

        it("Should fail creation when sender is not the employer", async () => {
            await initCreateFixture();
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams, { sender: contractorUser.signer }), 'Only the employer can create the contract');
        });

        it("Should fail creation when contractor address is the same as employer address", async () => {
            const jcc = getOnChainParams(baseJcc, { contractorAddress: ['address', employerUser.pubKey] });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams, { jcc }), 'Invalid C/E addresses');
        });

        it("Should fail creation when contractor is not verified", async () => {
            await initCreateFixture({ usersToVerify: [employerUser] });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams), 'Unverified contractor');
        });

        it("Should fail creation when employer is not verified", async () => {
            await initCreateFixture({ usersToVerify: [contractorUser] });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams), 'Unverified employer');
        });

        it("Should fail creation when duration is zero", async () => {
            const jcc = getOnChainParams(baseJcc, { durationDays: ['uint256', 0] });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams, { jcc }), 'Duration must be at least 1 day');
        });

        it("Should fail creation when percentages sum is not 100", async () => {
            const jcc = getOnChainParams(baseJcc, {
                initialDepositPct: ['uint8', 30],
                lockedAmountPct: ['uint8', 50],
                deferredAmountPct: ['uint8', 0],
            });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams, { jcc }), 'Sum of initialDepositPct, lockedAmountPct and deferredAmountPct must be 100');
        });

        it("Should fail creation if locked amount pct < contract fees pct", async () => {
            const jcc = getOnChainParams(baseJcc, {
                initialDepositPct: ['uint8', 94],
                lockedAmountPct: ['uint8', 6],
                deferredAmountPct: ['uint8', 0],
            });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams, { jcc }), 'Not enough locked amount to cover contract fees');
        });

        it("Should fail creation when signer isn't sigAuthority", async () => {
            await initCreateFixture();
            const signature = await signMessage(WRONG_SIG_AUTHORITY_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams, { signature }), 'Invalid signature');
        });

        it("Should fail creation if token transfer allowance is insufficient", async () => {
            await initCreateFixtureERC20({ linkApproval: { user: employerUser, price: getMinTransferApprovalAmount(baseJcc).minus(1) } });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams), 'ERC20: insufficient allowance');
        });

        it("Should fail creation if token balance is insufficient", async () => {
            await initCreateFixtureERC20({ transfer: { token: PaymentToken.Link, user: employerUser, price: LINK_PRICE.minus(1) } });
            await expectThrowsAsync(() => createJobContract(defaultCreateJobContractParams), 'Insufficient balance');
        });

    });

    describe("Finalization", () => {

        let baseJfc: Jfc;
        let baseJfcSignature: string;
        let defaultFinalizeJobContractParams: FinalizeJobContractParams;

        before(async () => {
            baseJfc = {
                contractId: ['string', 'contract-id'],
                ipfsJfiHash: ['string', 'bafkhsrc80ewgfrrgdniqbdfoaie5gkdmyu7bc33omizt5rrb5bnrreig4e'],
            };
        });

        async function initFinalizationFixture(nativePaymentToken = true, params?: Partial<JobContractCreateFixtureParams>) {
            let jcc: Jcc;
            if (nativePaymentToken) {
                ({ jcc } = await initCreateFixture(params));
            } else {
                ({ jcc } = await initCreateFixtureERC20({
                    ...{ linkApproval: { user: employerUser, price: LINK_PRICE } },
                    ...params,
                }));
            }
            const { txFee: creationTxFee } = await createJobContract(defaultCreateJobContractParams, { jcc, signature: jccSignature });
            baseJfcSignature = await signMessage(SIG_AUTHORITY_PV_KEY, ...Object.values(baseJfc));
            defaultFinalizeJobContractParams = {
                jfc: baseJfc,
                signature: baseJfcSignature,
                jobContract,
                ...nativePaymentToken && { wei: AVAX_PRICE.times(baseJcc.deferredAmountPct[1]).div(100) },
            };
            return {
                creationTxFee,
            };
        }

        describe("Using native token to pay", () => {

            it("Should finalize a job contract", async () => {
                const { creationTxFee } = await initFinalizationFixture();
                const { txFee: finalizationTxFee } = await finalizeJobContract(defaultFinalizeJobContractParams);

                // Validate finalized contract
                const contract = await jobContract.contracts(baseJfc.contractId[1]);
                expect(contract.state).to.equal(JobContractState.CompleteWithSuccess);
                expect(contract.ipfsJfiHash).to.equal(baseJfc.ipfsJfiHash[1]);

                // Validate balances
                expect((await getNativeBalance(jobContract.address))).eq(AVAX_PRICE.times(AUTHORITY_FEE_PCT).div(100).toFixed());
                expect((await getNativeBalance(employerUser.pubKey)).sub(TEST_INIT_AMOUNT).add(creationTxFee).add(finalizationTxFee)).eq('0');
                expect((await getNativeBalance(contractorUser.pubKey)).sub(TEST_INIT_AMOUNT)).eq(AVAX_PRICE.times(100 - AUTHORITY_FEE_PCT).div(100).toFixed());

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
                const jcc = getOnChainParams(baseJcc, {
                    initialDepositPct: ['uint8', percentages.initialDepositPct],
                    lockedAmountPct: ['uint8', percentages.lockedAmountPct],
                    deferredAmountPct: ['uint8', percentages.deferredAmountPct]
                });
                const { creationTxFee } = await initFinalizationFixture(true, { jcc });

                // Validate balances
                expect(await getNativeBalance(jobContract.address)).eq(AVAX_PRICE.toFixed());
                expect((await getNativeBalance(employerUser.pubKey)).sub(TEST_INIT_AMOUNT).add(creationTxFee)).eq('0');
                expect((await getNativeBalance(contractorUser.pubKey)).sub(TEST_INIT_AMOUNT)).eq('0');

                const { txFee } = await finalizeJobContract(defaultFinalizeJobContractParams, {
                    wei: AVAX_PRICE.times(percentages.deferredAmountPct).div(100),
                });

                // Validate balances
                expect(await getNativeBalance(jobContract.address)).eq(AVAX_PRICE.times(AUTHORITY_FEE_PCT).div(100).toFixed());
                expect((await getNativeBalance(employerUser.pubKey)).sub(TEST_INIT_AMOUNT).add(creationTxFee).add(txFee)).eq('0');
                expect((await getNativeBalance(contractorUser.pubKey)).sub(TEST_INIT_AMOUNT)).eq(AVAX_PRICE.times(100 - AUTHORITY_FEE_PCT).div(100).toFixed());
            });

            it("Should fail finalization of a job contract that has not started", async () => {
                await initFinalizationFixture();
                const jfc = getOnChainParams(baseJfc, { contractId: ['string', 'contract-id-new'] });
                const signature = await signMessage(SIG_AUTHORITY_PV_KEY, ...Object.values(jfc));
                await expectThrowsAsync(() => finalizeJobContract(defaultFinalizeJobContractParams, { jfc, signature }), 'Invalid contract state');
            });

            it("Should fail finalization when signer isn't sigAuthority", async () => {
                await initFinalizationFixture();
                const signature = await signMessage(WRONG_SIG_AUTHORITY_PV_KEY, ...Object.values(baseJfc));
                await expectThrowsAsync(() => finalizeJobContract(defaultFinalizeJobContractParams, { signature }), 'Invalid signature');
            });

        });

        describe("Using ERC20 to pay", () => {

            it("Should finalize a job contract", async () => {
                await initFinalizationFixture(false);
                await finalizeJobContract(defaultFinalizeJobContractParams);

                // Validate finalized contract
                const contract = await jobContract.contracts(baseJfc.contractId[1]);
                expect(contract.state).to.equal(JobContractState.CompleteWithSuccess);

                // Validate balances
                expect(await link.balanceOf(jobContract.address)).eq(LINK_PRICE.times(AUTHORITY_FEE_PCT).div(100).toFixed());
                expect(await link.balanceOf(employerUser.pubKey)).eq('0');
                expect(await link.balanceOf(contractorUser.pubKey)).eq(LINK_PRICE.times(100 - AUTHORITY_FEE_PCT).div(100).toFixed());
            });

            it("Should finalize a job contract with 100% in locked amount", async () => {
                const percentages = { initialDepositPct: 0, lockedAmountPct: 100, deferredAmountPct: 0 };
                const jcc = getOnChainParams(baseJcc, {
                    paymentToken: ['uint8', PaymentToken.Link],
                    initialDepositPct: ['uint8', percentages.initialDepositPct],
                    lockedAmountPct: ['uint8', percentages.lockedAmountPct],
                    deferredAmountPct: ['uint8', percentages.deferredAmountPct]
                });
                await initFinalizationFixture(false, { jcc });

                // Validate balances
                expect(await link.balanceOf(jobContract.address)).eq(LINK_PRICE.toFixed());
                expect(await link.balanceOf(employerUser.pubKey)).eq('0');
                expect(await link.balanceOf(contractorUser.pubKey)).eq('0');

                await finalizeJobContract(defaultFinalizeJobContractParams);

                // Validate balances
                expect(await link.balanceOf(jobContract.address)).eq(LINK_PRICE.times(AUTHORITY_FEE_PCT).div(100).toFixed());
                expect(await link.balanceOf(employerUser.pubKey)).eq('0');
                expect(await link.balanceOf(contractorUser.pubKey)).eq(LINK_PRICE.times(100 - AUTHORITY_FEE_PCT).div(100).toFixed());
            });

            it("Should fail finalization if deferred token transfer allowance is insufficient", async () => {
                await initFinalizationFixture(false, { linkApproval: { user: employerUser, price: getMinTransferApprovalAmount(baseJcc) } });
                await expectThrowsAsync(() => finalizeJobContract(defaultFinalizeJobContractParams), 'ERC20: insufficient allowance');
            });

        });

    });
});
