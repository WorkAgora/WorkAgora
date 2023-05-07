import { ethers } from "hardhat";
import { Wallet } from "ethers";
import { expect } from "chai";
import { ContractsType, expectThrowsAsync, getContractAt } from "./utils";
import { Employer, UserManager } from "../typechain-types/UserSystem/UserManager/UserManager.sol";
import { ReputationCard } from "../typechain-types/UserSystem/Reputation/ReputationCard.sol";

let userManager: UserManager;
const kycSystem = new Wallet('0x113ea374c34d11b617168b48aef9b29997684291a7c318fefb2ea5fff99d1776');
const kycId = '0a0a0a0a-1b1b1b1b-2c2c2c2c-3c3c3c3c';
const userAddress = '0xAC688F514468a753894893e5463938896EFF81b4'

describe("User verification", () => {
  beforeEach(async () => {
    // Deploy User contract
    const userManagerFactory = await ethers.getContractFactory("UserManager");
    userManager = await userManagerFactory.deploy() as UserManager;
    await userManager.initialize(kycSystem.address);
  });

  it("Should allow a user to verify themselves with a valid signature and emit an event", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await kycSystem.signMessage(ethers.utils.arrayify(messageHash));

    expect(await userManager.isUserVerified(userAddress)).to.equal(false);
    await expect(userManager.verifyUser(userAddress, kycId, signature))
      .to.emit(userManager, "UserVerified")
      .withArgs(userAddress);
    expect(await userManager.isUserVerified(userAddress)).to.equal(true);
  });

  it("Should reject a user with an invalid signature", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await Wallet.createRandom().signMessage(ethers.utils.arrayify(messageHash));

    expect(await userManager.isUserVerified(userAddress)).to.equal(false);
    await expectThrowsAsync(() => userManager.verifyUser(userAddress, kycId, signature), 'invalid signature');
  });

  it("Should not allow a user to verify themselves twice", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await kycSystem.signMessage(ethers.utils.arrayify(messageHash));

    expect(await userManager.isUserVerified(userAddress)).to.equal(false);
    await userManager.verifyUser(userAddress, kycId, signature);
    expect(await userManager.isUserVerified(userAddress)).to.equal(true);
    await expectThrowsAsync(() => userManager.verifyUser(userAddress, kycId, signature), 'already verified');
  });

  it("Should retrieve the kycId of a user after verification", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    const signature = await kycSystem.signMessage(ethers.utils.arrayify(messageHash));

    expect(await userManager.isUserVerified(userAddress)).to.equal(false);
    await userManager.verifyUser(userAddress, kycId, signature);
    expect(await userManager.isUserVerified(userAddress)).to.equal(true);

    expect(await userManager.verifiedUsers(userAddress)).to.equal(kycId);
  });
});

describe("User reputation", () => {
  beforeEach(async () => {
    // Deploy User contract
    const userManagerFactory = await ethers.getContractFactory("UserManager");
    userManager = await userManagerFactory.deploy() as UserManager;
    await userManager.initialize(kycSystem.address);
  });

  it("Fresh accounts should have 0 reviews and 0 reputation", async () => {
    const messageHash = ethers.utils.solidityKeccak256(['address', 'string'], [userAddress, kycId]);
    
    const signature = await kycSystem.signMessage(ethers.utils.arrayify(messageHash));

    await userManager.verifyUser(userAddress, kycId, signature);
    const employerProfileAddr = await userManager.Employers(userAddress);
    const employer = await getContractAt<Employer>(ContractsType.Employer, employerProfileAddr);
    
    const reputationCardAddr = await employer.getReputationCard();
    const reputationCard = await getContractAt<ReputationCard>(ContractsType.ReputationCard, reputationCardAddr);

    const reputation = await reputationCard.getReputation();
    const reviews = await reputationCard.getReviewsCount();
    expect(reputation).to.equal(0);
    expect(reviews).to.equal(0);
  });
});
