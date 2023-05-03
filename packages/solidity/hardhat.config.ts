import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-toolbox';
import '@primitivefi/hardhat-dodoc';
import "@nomicfoundation/hardhat-foundry";
import * as tdly from '@tenderly/hardhat-tenderly';
import { HardhatNetworkAccountUserConfig } from 'hardhat/types';
import { BigNumber, ethers } from 'ethers';
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
      chainId: 1337,
      allowUnlimitedContractSize: false,
      accounts: accounts.map(account => {
        const config: HardhatNetworkAccountUserConfig = {
          privateKey: account,
          balance: ethers.utils.parseUnits("10000","ether").toString(),
        }
        return config;
      })
    },
    tenderlyFork: {
      url: process.env.TENDERLY_FORK ?? '',
      accounts,
    },
    testnet: {
      url: process.env.NEXT_PUBLIC_TESTNET_RPC_URL,
      chainId: 43113,
      accounts,
    },
    mainnet: {
      url: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
      chainId: 43114,
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

export default config;
