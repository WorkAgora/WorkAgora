import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@primitivefi/hardhat-dodoc';
import * as tdly from '@tenderly/hardhat-tenderly';
tdly.setup();
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: false,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 50,
        passphrase: '',
      },
    },
    tenderlyFork: {
      url: process.env.TENDERLY_FORK ?? '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    testnet: {
      url: process.env.TESTNET_RPC_URL,
      chainId: 43113,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      chainId: 43114,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    token: 'AVAX',
    showTimeSpent: true,
    showMethodSig: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY ?? '',
  },
  etherscan: {
    apiKey: {
      testnet: process.env.SNOWTRACE_API_KEY ?? '',
      mainnet: process.env.SNOWTRACE_API_KEY ?? '',
    },
  },
  tenderly: {
    username: process.env.TENDERLY_USERNAME ?? '',
    project: process.env.TENDERLY_PROJECT ?? '',
    privateVerification: false,
  },
  dodoc: {
    runOnCompile: true,
    exclude: [],
    outputDir: 'docs',
  },
};

export default config;
