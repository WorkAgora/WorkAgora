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

## How to deploy a contract

There is three configured network :

- hardhat : Local network
- testnet : [Avalanche Fuji Testnet](https://chainlist.org/chain/43113)
- mainnet : [Avalanche C-Chain](https://chainlist.org/chain/43114)
