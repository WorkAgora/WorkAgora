import * as dotenv from 'dotenv';
import { HardhatUserConfig, task } from 'hardhat/config';
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-toolbox';
import '@primitivefi/hardhat-dodoc';
import "@nomicfoundation/hardhat-foundry";
import * as tdly from '@tenderly/hardhat-tenderly';
import { HardhatNetworkAccountUserConfig } from 'hardhat/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'ethers';
tdly.setup();
dotenv.config({ path: '../../.env' });

const accounts = process.env.HARDHAT_PRIVATE_KEYS ? process.env.HARDHAT_PRIVATE_KEYS.split(',') : [];
const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: 43112,
      accounts: accounts.map(account => {
        const config: HardhatNetworkAccountUserConfig = {
          privateKey: account,
          balance: ethers.utils.parseUnits("10000", "ether").toString(),
        }
        return config;
      })
    },
    testnet: {
      url: process.env.NEXT_PUBLIC_TESTNET_RPC_URL,
      chainId: 43113,
      accounts,
    },
    mainnet: {
      url: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
      gasPrice: 225000000000,
      chainId: 43114,
      accounts,
    },
    tenderlyFork: {
      url: process.env.TENDERLY_FORK ?? '',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts,
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    token: 'AVAX',
    showTimeSpent: true,
    showMethodSig: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY ?? ''
  },
  etherscan: {
    apiKey: {
      testnet: process.env.SNOWTRACE_API_KEY ?? '',
      mainnet: process.env.SNOWTRACE_API_KEY ?? ''
    }
  },
  tenderly: {
    username: process.env.TENDERLY_USERNAME ?? '',
    project: process.env.TENDERLY_PROJECT ?? '',
    privateVerification: false
  },
  dodoc: {
    runOnCompile: true,
    exclude: [],
    outputDir: 'docs'
  }
};

task("accounts", "Prints the list of accounts", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  accounts.forEach((account: SignerWithAddress): void => {
    console.log(account.address)
  })
})

task("balances", "Prints the list of AVAX account balances", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  accounts.forEach(async (account: SignerWithAddress): Promise<void> => {
    const balance = await hre.ethers.provider.getBalance(account.address);
    console.log(`${account.address} has balance ${ethers.utils.formatEther(balance)}`);
  })
})

export default config;
