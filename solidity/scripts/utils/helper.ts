import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { KeyValueLog, TitleLog } from './logger';

const getOwner = async (log = false): Promise<SignerWithAddress> => {
  const [owner] = await ethers.getSigners();
  log &&
    console.log(
      `${TitleLog('OWNER INFO')}\n${KeyValueLog(
        'ADDRESS',
        owner.address
      )}\n${KeyValueLog('BALANCE', (await owner.getBalance()).toString())}`
    );
  return owner;
};

export { getOwner };
