import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BACKEND_PV_KEY, UserTestInfo, deployBaseContracts, expectThrowsAsync, getSignersInfo, signMessage } from "./utils";
import { Jcc, JobContractState, createJobContract, getJcc } from "./utils/jobContract";
import { verifyUsers } from "./utils/userManager";
import { PaymentToken } from "./utils/priceController";
import BigNumber from "bignumber.js";
import { JobContract, UserManager, WrappedAvaxToken } from "../typechain-types";

type JobContractFixtureParams = {
    usersToVerify: UserTestInfo[],
    wavaxTransfer?: {
        user: UserTestInfo,
        price: BigNumber,
    },
    wavaxApproval?: {
        user: UserTestInfo,
        price: BigNumber,
    },
};

describe("Job contracts", () => {

    /**
      For AVAX/USD regtests price see: {@link ./utils/priceController.ts|tokensInfo}
    */
    const avaxPrice = new BigNumber('68000000000000000000');
    let baseJcc: Jcc;
    let contractor: UserTestInfo;
    let employer: UserTestInfo;
    let userManager: UserManager;
    let jobContract: JobContract;
    let wavax: WrappedAvaxToken;
    let defaultFixtureParams: JobContractFixtureParams;
    
    async function initCreationFixture(_params?: Partial<JobContractFixtureParams>) {
        const params = {
            ...defaultFixtureParams,
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
        defaultFixtureParams = {
            usersToVerify: [employer, contractor],
            wavaxTransfer: { user: employer, price: avaxPrice },
            wavaxApproval: { user: employer, price: avaxPrice },
        };
    });

    describe("Creation", () => {

        it("Should create a contract", async () => {
            await initCreationFixture();
            expect(await wavax.balanceOf(jobContract.address)).eq('0');
            expect(await wavax.balanceOf(employer.pubKey)).eq('68000000000000000000');
            expect(await wavax.balanceOf(contractor.pubKey)).eq('0');

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await createJobContract(baseJcc, signature, jobContract);

            // Validate saved contract
            const contract = await jobContract.contracts(baseJcc.contractId[1]);
            expect(contract.length).to.equal(8);
            expect(contract[0]).to.equal(baseJcc.contractId[1]);
            expect(contract[1]).to.equal(JobContractState.Started);
            expect(contract[2]).to.equal(baseJcc.totalAmountUsd[1]);
            expect(contract[3]).to.equal(PaymentToken.Avax);
            expect(contract[4]).to.equal(baseJcc.durationDays[1]);
            expect(contract[5]).to.equal(baseJcc.contractorAddress[1]);
            expect(contract[6]).to.equal(baseJcc.employerAddress[1]);
            expect(contract[7]).to.equal(baseJcc.ipfsJmiHash[1]);

            // Validate balances
            expect(await wavax.balanceOf(jobContract.address)).eq('34000000000000000000'); // 50% - locked
            expect(await wavax.balanceOf(employer.pubKey)).eq('13600000000000000000'); // 20% - deferred
            expect(await wavax.balanceOf(contractor.pubKey)).eq('20400000000000000000'); // 30% - initial deposit
        });

        it("Should fail creation with an existing contractId", async () => {
            await initCreationFixture();

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await createJobContract(baseJcc, signature, jobContract);
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract), 'ContractId already exists');
        });

        it("Should fail creation with an expiry timestamp in the past", async () => {
            await initCreationFixture();

            const jcc = getJcc(baseJcc, { creationExpiryTimestamp: ['uint256', 1652633694] });
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(jcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Creation timestamp expired');
        });

        it("Should fail creation when sender is not the employer", async () => {
            await initCreationFixture();

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract, contractor.signer), 'Only the employer can create the contract');
        });

        it("Should fail creation when contractor address is the same as employer address", async () => {
            await initCreationFixture();

            const jcc = getJcc(baseJcc, { contractorAddress: ['address', employer.pubKey] });
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(jcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Invalid C/E addresses');
        });

        it("Should fail creation when contractor is not verified", async () => {
            await initCreationFixture({ usersToVerify: [employer] });

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract), 'Unverified contractor');
        });

        it("Should fail creation when duration is zero", async () => {
            await initCreationFixture();

            const jcc = getJcc(baseJcc, { durationDays: ['uint256', 0] })
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(jcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Duration must be at least 1 day');
        });

        it("Should fail creation when signature is invalid", async () => {
            await initCreationFixture();

            const jcc = getJcc(baseJcc, { contractId: ['uint256', '2'] }); // change anything in jcc
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Invalid signature');
        });

        it("Should fail creation if token balance is insufficient", async () => {
            await initCreationFixture({ wavaxTransfer: { user: employer, price: avaxPrice.minus(1) }});

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract), 'Insufficient balance');
        });

    });

});
