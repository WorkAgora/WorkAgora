import { ethers } from "hardhat";
import { Wallet } from "ethers";
import { UserProfile } from "../typechain-types";
import { expect } from "chai";
import { expectThrowsAsync } from "./utils";

describe("UserProfile", () => {
  let userProfile: UserProfile;
  const kycSystem = new Wallet('0x113ea374c34d11b617168b48aef9b29997684291a7c318fefb2ea5fff99d1776');
  const kycId = '0a0a0a0a-1b1b1b1b-2c2c2c2c-3c3c3c3c';
  const userAddress = '0xAC688F514468a753894893e5463938896EFF81b4'

  beforeEach(async () => {
    // Deploy UserProfile contract
    const userProfileFactory = await ethers.getContractFactory("UserProfile");
    userProfile = await userProfileFactory.deploy();
    await userProfile.initialize(kycSystem.address);
  });

  it("Should allow a user to verify themselves with a valid signature", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await kycSystem.signMessage(ethers.utils.arrayify(messageHash));

    expect(await userProfile.isUserVerified(userAddress)).to.equal(false);
    await userProfile.verifyUser(userAddress, kycId, signature);
    expect(await userProfile.isUserVerified(userAddress)).to.equal(true);
  });

  it("Should reject a user with an invalid signature", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await Wallet.createRandom().signMessage(ethers.utils.arrayify(messageHash));

    expect(await userProfile.isUserVerified(userAddress)).to.equal(false);
    await expectThrowsAsync(() => userProfile.verifyUser(userAddress, kycId, signature), 'invalid signature');
  });

  it("Should not allow a user to verify themselves twice", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await kycSystem.signMessage(ethers.utils.arrayify(messageHash));

    expect(await userProfile.isUserVerified(userAddress)).to.equal(false);
    await userProfile.verifyUser(userAddress, kycId, signature);
    expect(await userProfile.isUserVerified(userAddress)).to.equal(true);
    await expectThrowsAsync(() => userProfile.verifyUser(userAddress, kycId, signature), 'Already verified');
  });

  it("Should retrieve the kycId of a user after verification", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await kycSystem.signMessage(ethers.utils.arrayify(messageHash));

    expect(await userProfile.isUserVerified(userAddress)).to.equal(false);
    await userProfile.verifyUser(userAddress, kycId, signature);
    expect(await userProfile.isUserVerified(userAddress)).to.equal(true);

    expect(await userProfile.verifiedUsers(userAddress)).to.equal(kycId);
  });
});
