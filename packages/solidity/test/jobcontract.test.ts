import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BACKEND_PV_KEY, deployBaseContracts, expectThrowsAsync, signMessage, usersInfo } from "./utils";
import { Jcc, JobContractState, createJobContract, getJcc } from "./utils/jobContract";
import { verifyUsers } from "./utils/user";

const [employer, contractor] = usersInfo;
const baseJcc: Jcc = {
    contractId: ['uint256', 1],
    priceUsd: ['uint256', 1000],
    durationDays: ['uint256', 2],
    creationExpiryTimestamp: ['uint256', 4082502246],
    contractorAddress: ['address', contractor.pubKey],
    employerAddress: ['address', employer.pubKey],
    ipfsJmiHash: ['string', 'bafkreig4eie3hu7bc33omizt5rrb5bnrloewgfrrgdniqbdfoaie5gkdmy'],
};

describe("Job contracts", () => {

    it("Should create a contract", async () => {
        const { user, jobContract } = await loadFixture(deployBaseContracts);
        await verifyUsers(user, employer, contractor);

        const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(baseJcc));
        await createJobContract(baseJcc, signature, jobContract);

        const contract = await jobContract.contracts(baseJcc.contractId[1]);
        expect(contract.length).to.equal(8);
        expect(contract[0]).to.equal(baseJcc.contractId[1]);
        expect(contract[1]).to.equal(baseJcc.priceUsd[1]);
        expect(contract[2]).to.equal(baseJcc.durationDays[1]);
        expect(contract[3]).to.equal(baseJcc.creationExpiryTimestamp[1]);
        expect(contract[4]).to.equal(baseJcc.contractorAddress[1]);
        expect(contract[5]).to.equal(baseJcc.employerAddress[1]);
        expect(contract[6]).to.equal(JobContractState.Started);
        expect(contract[7]).to.equal(baseJcc.ipfsJmiHash[1]);
    });

    it("Should fail creation with an expiry timestamp in the past", async () => {
        const { user, jobContract } = await loadFixture(deployBaseContracts);
        await verifyUsers(user, employer, contractor);

        const jcc = getJcc(baseJcc, { creationExpiryTimestamp: ['uint256', 1652633694] })
        const signature = await signMessage(BACKEND_PV_KEY, ...Object.values(jcc));
        await expectThrowsAsync(() => createJobContract(jcc, signature, jobContract), 'Creation timestamp expired');
    });

});
