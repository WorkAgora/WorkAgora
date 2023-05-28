import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { SIG_AUTHORITY_PV_KEY, UserTestInfo, deployBaseContracts, expectThrowsAsync, getSignersInfo, signMessage } from "./utils";
import { Jcc, Jfc, JobContractState, createJobContract, finalizeJobContract, getOnChainParams } from "./utils/jobContract";
import { verifyUsers } from "./utils/userManager";
import { PaymentToken } from "./utils/priceController";
import BigNumber from "bignumber.js";
import { JobContract, UserManager, WrappedAvaxToken } from "../typechain-types";

const WRONG_SIG_AUTHORITY_PV_KEY = '0x4747474747474747474747474747474747474747474747474747474747474747';
const AVAX_PRICE = new BigNumber('68000000000000000000');

type JobContractCreateFixtureParams = {
    usersToVerify: UserTestInfo[],
    wavaxTransfer?: {
        user: UserTestInfo,
        price: BigNumber,
    },
    wavaxApproval?: {
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
    let contractor: UserTestInfo;
    let employer: UserTestInfo;
    let userManager: UserManager;
    let jobContract: JobContract;
    let wavax: WrappedAvaxToken;
    let defaultFixtureCreateParams: JobContractCreateFixtureParams;

    async function initCreateFixture(_params?: Partial<JobContractCreateFixtureParams>) {
        const params = {
            ...defaultFixtureCreateParams,
            ..._params,
        };
        ({ userManager, jobContract, wavax } = await loadFixture(deployBaseContracts));
        const { usersToVerify, wavaxTransfer, wavaxApproval } = params;
        await verifyUsers(userManager, ...usersToVerify);
        if (wavaxTransfer) {
            await wavax.transfer(wavaxTransfer!.user.pubKey, wavaxTransfer!.price.toFixed());
        }
        if (wavaxApproval) {
            await wavax.connect(wavaxApproval.user.signer).approve(jobContract.address, wavaxApproval.price.toFixed());
        }
        jccSignature = await signMessage(SIG_AUTHORITY_PV_KEY, ...Object.values(_params?.jcc || baseJcc));
    }

    async function expectBalances(contractBalance: string, employerBalance: string, contractorBalance: string) {
        expect(await wavax.balanceOf(jobContract.address)).eq(contractBalance);
        expect(await wavax.balanceOf(employer.pubKey)).eq(employerBalance);
        expect(await wavax.balanceOf(contractor.pubKey)).eq(contractorBalance);
    }

    function getMinTransferApprovalAmount(jcc: Jcc) {
        return AVAX_PRICE.times(jcc.initialDepositPct[1] + jcc.lockedAmountPct[1]).div(100);
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
        ({ contractor, employer } = signers);
        baseJcc = {
            contractId: ['string', 'contract-id'],
            totalAmountUsd: ['uint256', 1000],
            paymentToken: ['uint8', PaymentToken.Avax],
            initialDepositPct: ['uint8', 30],
            lockedAmountPct: ['uint8', 50],
            deferredAmountPct: ['uint8', 20],
            durationDays: ['uint256', 2],
            creationExpiryTimestamp: ['uint256', 4082502246],
            contractorAddress: ['address', contractor.pubKey],
            employerAddress: ['address', employer.pubKey],
            ipfsJmiHash: ['string', 'bafkreig4eie3hu7bc33omizt5rrb5bnrloewgfrrgdniqbdfoaie5gkdmy'],
        };
        defaultFixtureCreateParams = {
            usersToVerify: [employer, contractor],
            wavaxTransfer: { user: employer, price: AVAX_PRICE },
            wavaxApproval: { user: employer, price: getMinTransferApprovalAmount(baseJcc) },
        };
    });

    describe("Creation", () => {

        it("Should create a contract", async () => {
            await initCreateFixture();
            expect(await wavax.balanceOf(jobContract.address)).eq('0');
            expect(await wavax.balanceOf(employer.pubKey)).eq(AVAX_PRICE.toFixed());
            expect(await wavax.balanceOf(contractor.pubKey)).eq('0');

            await createJobContract(baseJcc, jccSignature, jobContract);

            // Validate created contract
            const contract = await jobContract.contracts(baseJcc.contractId[1]);
            expect(contract.length).to.equal(11);
            expect(contract[0]).to.equal(baseJcc.contractId[1]);
            expect(contract[1]).to.equal(JobContractState.Started);
            expect(contract[2]).to.equal(AVAX_PRICE.toFixed());
            expect(contract[3]).to.equal(baseJcc.lockedAmountPct[1]);
            expect(contract[4]).to.equal(baseJcc.deferredAmountPct[1]);
            expect(contract[5]).to.equal(PaymentToken.Avax);
            expect(contract[6]).to.equal(baseJcc.durationDays[1]);
            expect(contract[7]).to.equal(baseJcc.contractorAddress[1]);
            expect(contract[8]).to.equal(baseJcc.employerAddress[1]);
            expect(contract[9]).to.equal(baseJcc.ipfsJmiHash[1]);
            expect(contract[10]).to.equal('');

            // Validate balances
            expect(await wavax.balanceOf(jobContract.address)).eq('34000000000000000000'); // 50% - locked
            expect(await wavax.balanceOf(employer.pubKey)).eq('13600000000000000000'); // 20% - deferred
            expect(await wavax.balanceOf(contractor.pubKey)).eq('20400000000000000000'); // 30% - initial deposit
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
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract, contractor.signer), 'Only the employer can create the contract');
        });

        it("Should fail creation when contractor address is the same as employer address", async () => {
            const jcc = getOnChainParams(baseJcc, { contractorAddress: ['address', employer.pubKey] });
            await initCreateFixture({ jcc });
            await expectThrowsAsync(() => createJobContract(jcc, jccSignature, jobContract), 'Invalid C/E addresses');
        });

        it("Should fail creation when contractor is not verified", async () => {
            await initCreateFixture({ usersToVerify: [employer] });
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract), 'Unverified contractor');
        });

        it("Should fail creation when employer is not verified", async () => {
            await initCreateFixture({ usersToVerify: [contractor] });
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
            await initCreateFixture({ wavaxApproval: { user: employer, price: getMinTransferApprovalAmount(baseJcc).minus(1) } });
            await expectThrowsAsync(() => createJobContract(baseJcc, jccSignature, jobContract), 'ERC20: insufficient allowance');
        });

        it("Should fail creation if token balance is insufficient", async () => {
            await initCreateFixture({ wavaxTransfer: { user: employer, price: AVAX_PRICE.minus(1) } });
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
                wavaxApproval: { user: employer, price: AVAX_PRICE },
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
            expect(contract[1]).to.equal(JobContractState.CompleteWithSuccess);
            expect(contract[10]).to.equal(baseJfc.ipfsJfiHash[1]);

            // Validate balances
            await expectBalances('0', '0', AVAX_PRICE.toFixed());
        });

        it("Should finalize a job contract with 100% in locked amount", async () => {
            const percentages = { initialDepositPct: 0, lockedAmountPct: 100, deferredAmountPct: 0 };
            const jcc = getJccCustomPct(baseJcc, percentages);
            await initFinalizationFixture({ jcc });

            await expectBalances(AVAX_PRICE.toFixed(), '0', '0');
            await finalizeJobContract(baseJfc, baseJfcSignature, jobContract);
            await expectBalances('0', '0', AVAX_PRICE.toFixed());
        });

        it("Should finalize a job contract with 100% in deferred amount", async () => {
            const percentages = { initialDepositPct: 0, lockedAmountPct: 0, deferredAmountPct: 100 };
            const jcc = getJccCustomPct(baseJcc, percentages);
            await initFinalizationFixture({ jcc });

            await expectBalances('0', AVAX_PRICE.toFixed(), '0');
            await finalizeJobContract(baseJfc, baseJfcSignature, jobContract);
            await expectBalances('0', '0', AVAX_PRICE.toFixed());
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
            await initFinalizationFixture({ wavaxApproval: { user: employer, price: getMinTransferApprovalAmount(baseJcc) } });
            await expectThrowsAsync(() => finalizeJobContract(baseJfc, baseJfcSignature, jobContract), 'ERC20: insufficient allowance');
        });

    });
});
