import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BACKEND_PV_KEY, deployBaseContracts, expectThrowsAsync, signMessage, usersInfo } from "./utils";
import { Role, verifyUsers } from "./utils/user";

describe("User", () => {

  describe("Verification", () => {

    it("Should allow a user to verify themselves with a valid signature and emit an event", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      const signature = await signMessage(BACKEND_PV_KEY, ['address', usersInfo[0].pubKey], ['string', usersInfo[0].kycId]);

      expect(await user.isUserVerified(usersInfo[0].pubKey)).to.equal(false);
      await expect(user.verifyUser(usersInfo[0].pubKey, usersInfo[0].kycId, signature))
        .to.emit(user, "UserVerified")
        .withArgs(usersInfo[0].pubKey);
      expect(await user.isUserVerified(usersInfo[0].pubKey)).to.equal(true);
    });

    it("Should reject a user with an invalid signature", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      const signature = await signMessage(BACKEND_PV_KEY, ['address', usersInfo[0].pubKey], ['string', usersInfo[0].kycId]);

      expect(await user.isUserVerified(usersInfo[0].pubKey)).to.equal(false);
      await expectThrowsAsync(() => user.verifyUser(usersInfo[0].pubKey, usersInfo[1].kycId, signature), 'Invalid signature');
    });

    it("Should retrieve the kycId of a user after verification", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      await verifyUsers(user, usersInfo[0]);

      const kycId = (await user.verifiedUsers(usersInfo[0].pubKey)).kycId;
      expect(kycId).to.equal(kycId);
    });

    it("Should properly assign ids to users", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      await verifyUsers(user, usersInfo[0], usersInfo[1]);
      const employer1Id = (await user.verifiedUsers(usersInfo[0].pubKey)).employerId;
      const contractor1Id = (await user.verifiedUsers(usersInfo[0].pubKey)).contractorId;
      const employer2Id = (await user.verifiedUsers(usersInfo[1].pubKey)).employerId;
      const contractor2Id = (await user.verifiedUsers(usersInfo[1].pubKey)).contractorId;
      expect(employer1Id).to.equal(1);
      expect(contractor1Id).to.equal(2);
      expect(employer2Id).to.equal(3);
      expect(contractor2Id).to.equal(4);
    });

    it("Should not allow a user to verify themselves twice", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      const [{ signature }] = await verifyUsers(user, usersInfo[0]);
      await expectThrowsAsync(() => user.verifyUser(usersInfo[0].pubKey, usersInfo[0].kycId, signature), 'Already verified');
    });
  });

  describe("Reputation", () => {

    it("Fresh accounts should have 0 reviews and 0 reputation", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      await verifyUsers(user, usersInfo[0]);

      const employerRep = await user.getReputation(usersInfo[0].pubKey, Role.Employer);
      const contractorRep = await user.getReputation(usersInfo[0].pubKey, Role.Contractor);
      expect(employerRep).to.equal(0);
      expect(contractorRep).to.equal(0);
    });

    it("Should not allow getting unverified users reputation", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      await verifyUsers(user, usersInfo[0]);

      await expectThrowsAsync(() => user.getReputation(usersInfo[1].pubKey, Role.Employer), 'User not verified');
      await expectThrowsAsync(() => user.getReputation(usersInfo[1].pubKey, Role.Contractor), 'User not verified');
    });

    it("Should not allow getting reputation with an invalid role", async () => {
      const { user } = await loadFixture(deployBaseContracts);
      await verifyUsers(user, usersInfo[0]);

      await expect(user.getReputation(usersInfo[0].pubKey, 0)).not.to.be.reverted;
      await expect(user.getReputation(usersInfo[0].pubKey, 1)).not.to.be.reverted;
      await expect(user.getReputation(usersInfo[0].pubKey, 2)).to.be.reverted;
    });

  });

});
