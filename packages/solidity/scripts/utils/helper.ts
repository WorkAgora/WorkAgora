import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { logger } from './logger';
import { promisify } from 'util';

export const sleep = promisify(setTimeout);

const getOwner = async (log = false): Promise<SignerWithAddress> => {
  const [owner] = await ethers.getSigners();
  log && logger.logTitle('OWNER INFO',
    ['ADDRESS', owner.address],
    ['BALANCE', (await owner.getBalance()).toString()]);
  return owner;
};

export { getOwner };
