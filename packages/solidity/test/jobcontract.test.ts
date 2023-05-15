import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { KYC_SYSTEM_PV_KEY, deployBaseContracts, signMessage, usersInfo, verifyUsers } from "./utils";

describe("Job contracts", () => {

    it("Should create a contract", async () => {
        const { user, jobContract } = await loadFixture(deployBaseContracts);
        const [employer, contractor] = usersInfo;
        await verifyUsers(user, employer, contractor);

        const jcc = {
            contractId: ['uint256', 1] as [string, number],
            priceUsd: ['uint256', 1000] as [string, number],
            durationDays: ['uint256', 2] as [string, number],
            creationExpiryTimestamp: ['uint256', 4082502246] as [string, number],
            contractorAddress: ['address', contractor.pubKey] as [string, string],
            employerAddress: ['address', employer.pubKey] as [string, string],
            ipfsJmiHash: ['bytes', Buffer.from('bafkreig4eie3hu7bc33omizt5rrb5bnrloewgfrrgdniqbdfoaie5gkdmy', 'utf-8')] as [string, Buffer],
        }
        const signature = await signMessage(KYC_SYSTEM_PV_KEY, jcc.contractId, jcc.priceUsd, jcc.durationDays, jcc.creationExpiryTimestamp, jcc.contractorAddress, jcc.employerAddress, jcc.ipfsJmiHash);
        await jobContract.create(jcc.contractId[1], jcc.priceUsd[1], jcc.durationDays[1], jcc.creationExpiryTimestamp[1], jcc.contractorAddress[1], jcc.employerAddress[1], jcc.ipfsJmiHash[1], signature)
        const kycId = (await user.verifiedUsers(usersInfo[0].pubKey)).kycId;
        expect(kycId).to.equal(kycId);
    });

});
