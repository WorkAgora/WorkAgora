import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { logger } from './logger';

const getOwner = async (log: boolean = false): Promise<SignerWithAddress> => {
  const [owner] = await ethers.getSigners();
  log && logger.logInfoTitle('OWNER INFO',
    ['ADDRESS', owner.address],
    ['BALANCE', (await owner.getBalance()).toString()]);
  return owner;
};

export { getOwner };