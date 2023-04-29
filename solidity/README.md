# WorkAurora - Solidity

This repo use :

- Hardhat
- Chai/Jest

## How to start with

First you will need to install the package :

**_If you don't have yarn install it :)_**

```bash
$ yarn
```

In a second time you must copy `.env.example` to `.env` and fill the different API key used :

- `COINMARKETCAP_API_KEY` -> get one on [coinmarketcap](https://coinmarketcap.com/api/)
- `SNOWTRACE_API_KEY` -> get one on [snowtrace](https://snowtrace.io/)
- `Tenderly` -> you must create an account [here](https://tenderly.co/)

## How to deploy a contract

There is three configured network :

- hardhat : Local network
- testnet : [Avalanche Fuji Testnet](https://chainlist.org/chain/43113)
- mainnet : [Avalanche C-Chain](https://chainlist.org/chain/43114)

## Contract requirements

### Work Contract

- To be able to sign a work contract you must pass a KYC
- Every work contract have a % retained by the system to prevent faking it (and then faking the reputation system)
  - % retained must be given to DAO and Team wallet for the production and exploitation
- Contract must engage two different address
- Contract must have a snapshot of the contractor address to ensure that he have a % of the amount of money to pay the contract
- Options before contract:
  - take a snapshot of a % of the money of the contractor
  - both party choose the retain %
  - contractor must commit a % in the escrow system
  - both party choose the payment milestones (ie: send x% every x month/week/day)
    - if payment milestones are not done, you can launch a dispute in the Dispute System
  - freelancer must commit a hash of github to ensure the work is done for payment milestones
