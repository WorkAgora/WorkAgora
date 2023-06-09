import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { SIG_AUTHORITY_PV_KEY, UserTestInfo, expectThrowsAsync, getSignersInfo, signMessage } from "./utils";
import { Role, verifyUsers } from "./utils/userManager";
import { deployAllContracts } from "../scripts/utils/contracts";

describe("User", () => {

  let contractor: UserTestInfo;
  let employer: UserTestInfo;
  before(async () => {
    const signers = await getSignersInfo();
    ({contractor, employer} = signers);
  });

  describe("Verification", () => {

    it("Should allow a user to verify themselves with a valid signature and emit an event", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      const signature = await signMessage(SIG_AUTHORITY_PV_KEY, ['address', employer.pubKey], ['string', employer.kycId]);

      expect(await userManager.isUserVerified(employer.pubKey)).to.equal(false);
      await userManager.verifyUser(employer.pubKey, employer.kycId, signature);
      expect(await userManager.isUserVerified(employer.pubKey)).to.equal(true);
    });

    it("Should reject a user with an invalid signature", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      const signature = await signMessage(SIG_AUTHORITY_PV_KEY, ['address', employer.pubKey], ['string', employer.kycId]);

      expect(await userManager.isUserVerified(employer.pubKey)).to.equal(false);
      await expectThrowsAsync(() => userManager.verifyUser(employer.pubKey, contractor.kycId, signature), 'Invalid signature');
    });

    it("Should retrieve the kycId of a user after verification", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      await verifyUsers(userManager, employer);

      const kycId = (await userManager.verifiedUsers(employer.pubKey)).kycId;
      expect(kycId).to.equal(kycId);
    });

    it("Should properly assign ids to users", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      await verifyUsers(userManager, employer, contractor);
      const employer1Id = (await userManager.verifiedUsers(employer.pubKey)).employerId;
      const contractor1Id = (await userManager.verifiedUsers(employer.pubKey)).contractorId;
      const employer2Id = (await userManager.verifiedUsers(contractor.pubKey)).employerId;
      const contractor2Id = (await userManager.verifiedUsers(contractor.pubKey)).contractorId;
      expect(employer1Id).to.equal(1);
      expect(contractor1Id).to.equal(2);
      expect(employer2Id).to.equal(3);
      expect(contractor2Id).to.equal(4);
    });

    it("Should not allow a user to verify themselves twice", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      const [{ signature }] = await verifyUsers(userManager, employer);
      await expectThrowsAsync(() => userManager.verifyUser(employer.pubKey, employer.kycId, signature), 'Already verified');
    });
  });

  describe("Reputation", () => {

    it("Fresh accounts should have 0 reviews and 0 reputation", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      await verifyUsers(userManager, employer);

      const employerRep = await userManager.getReputation(employer.pubKey, Role.Employer);
      const contractorRep = await userManager.getReputation(employer.pubKey, Role.Contractor);
      expect(employerRep).to.equal(0);
      expect(contractorRep).to.equal(0);
    });

    it("Should not allow getting unverified users reputation", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      await verifyUsers(userManager, employer);

      await expectThrowsAsync(() => userManager.getReputation(contractor.pubKey, Role.Employer), 'User not verified');
      await expectThrowsAsync(() => userManager.getReputation(contractor.pubKey, Role.Contractor), 'User not verified');
    });

    it("Should not allow getting reputation with an invalid role", async () => {
      const { userManager } = await loadFixture(deployAllContracts);
      await verifyUsers(userManager, employer);

      await expect(userManager.getReputation(employer.pubKey, 0)).not.to.be.reverted;
      await expect(userManager.getReputation(employer.pubKey, 1)).not.to.be.reverted;
      await expect(userManager.getReputation(employer.pubKey, 2)).to.be.reverted;
    });

  });

});
