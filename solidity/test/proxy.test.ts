import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

describe('Proxy Test', function () {
  it('Should deploy and upgrade the UserProfile contract using a proxy', async () => {
    const [_ /* governance */, user] = await ethers.getSigners();
    // deploy
    const v1Factory = await ethers.getContractFactory('TestUserProfileV1');
    const proxy = await upgrades.deployProxy(v1Factory, [], { initializer: 'setGovernance' });

    // register user
    await proxy.connect(user).registerUser();
    expect(await proxy.isUserRegistered(user.address)).to.equal(true);

    // upgrade
    const v2Factory = await ethers.getContractFactory('TestUserProfileV2');
    const upgradedProxy = await upgrades.upgradeProxy(proxy.address, v2Factory);
    expect(proxy.address).to.equal(upgradedProxy.address);

    // verify user
    expect(await upgradedProxy.isUserVerified(user.address)).to.equal(false);
    await upgradedProxy.verifyUser(user.address);
    expect(await upgradedProxy.isUserVerified(user.address)).to.equal(true);
  });
});