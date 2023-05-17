import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BACKEND_PV_KEY, deployBaseContracts, expectThrowsAsync, signMessage, usersInfo } from "./utils";
import { Jcc, JobContractState, createJobContract, getJcc } from "./utils/jobContract";
import { verifyUsers } from "./utils/user";
import { ethers } from "hardhat";

const [employer, contractor] = usersInfo;
const baseJcc: Jcc = {
    contractId: ['string', 'contract-id'],
    totalAmountUsd: ['uint256', 1000],
    initialDepositPct: ['uint8', 30],
    lockedAmountPct: ['uint8', 50],
    deferredAmountPct: ['uint8', 20],
    durationDays: ['uint256', 2],
    creationExpiryTimestamp: ['uint256', 4082502246],
    contractorAddress: ['address', contractor.pubKey],
    employerAddress: ['address', employer.pubKey],
    ipfsJmiHash: ['string', 'bafkreig4eie3hu7bc33omizt5rrb5bnrloewgfrrgdniqbdfoaie5gkdmy'],
};

describe("Job contracts", () => {

    describe("Creation", () => {

        it("Should create a contract", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer, contractor);

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await createJobContract(baseJcc, signature, jobContract);

            const contract = await jobContract.contracts(baseJcc.contractId[1]);
            expect(contract.length).to.equal(7);
            expect(contract[0]).to.equal(baseJcc.contractId[1]);
            expect(contract[1]).to.equal(JobContractState.Started);
            expect(contract[2]).to.equal(baseJcc.totalAmountUsd[1]);
            expect(contract[3]).to.equal(baseJcc.durationDays[1]);
            expect(contract[4]).to.equal(baseJcc.contractorAddress[1]);
            expect(contract[5]).to.equal(baseJcc.employerAddress[1]);
            expect(contract[6]).to.equal(baseJcc.ipfsJmiHash[1]);
        });

        it("Should fail creation with an expiry timestamp in the past", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer, contractor);

            const jcc = getJcc(baseJcc, { creationExpiryTimestamp: ['uint256', 1652633694] });
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(jcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Creation timestamp expired');
        });

        it("Should fail creation with an existing contractId", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer, contractor);

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await createJobContract(baseJcc, signature, jobContract);
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract), 'ContractId already exists');
        });

        it("Should fail creation when sender is not the employer", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer, contractor);

            const [, contractorSigner] = (await ethers.getSigners());
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract, contractorSigner), 'Only the employer can create the contract');
        });

        it("Should fail creation when contractor address is the same as employer address", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer, contractor);

            const jcc = getJcc(baseJcc, { contractorAddress: ['address', employer.pubKey] });
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(jcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Invalid C/E addresses');
        });

        it("Should fail creation when contractor is not verified", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer);

            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(baseJcc, signature, jobContract), 'Unverified contractor');
        });

        it("Should fail creation when duration is zero", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer, contractor);

            const jcc = getJcc(baseJcc, { durationDays: ['uint256', 0] })
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(jcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Duration must be at least 1 day');
        });

        it("Should fail creation when signature is invalid", async () => {
            const { user, jobContract } = await loadFixture(deployBaseContracts);
            await verifyUsers(user, employer, contractor);

            const jcc = getJcc(baseJcc, { contractId: ['uint256', '2'] }); // change anything in jcc
            const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
            await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Invalid signature');
        });

    });

});
