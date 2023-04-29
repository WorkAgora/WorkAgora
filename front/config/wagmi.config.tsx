import { createClient, configureChains, Chain } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import {
  metaMaskWallet,
  ledgerWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet
} from '@rainbow-me/rainbowkit/wallets';

import {
  connectorsForWallets,
  createAuthenticationAdapter,
  DisclaimerComponent,
  lightTheme
} from '@rainbow-me/rainbowkit';

let chain: Chain = avalancheFuji;
let rpc_url = process.env.NEXT_PUBLIC_TESTNET_RPC_URL;
if (process.env.NEXT_PUBLIC_BC_ENV === 'production') {
  chain = avalanche;
  rpc_url = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
}

const { provider, chains } = configureChains(
  [chain],
  [
    jsonRpcProvider({
      rpc: () => {
        if (!rpc_url) return null;
        return { http: rpc_url };
      }
    })
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [ledgerWallet({ chains })]
  },
  {
    groupName: 'Possible',
    wallets: [
      metaMaskWallet({ chains, shimDisconnect: true }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ appName: 'WorkAurora', chains }),
      trustWallet({ chains, shimDisconnect: true })
    ]
  }
]);

const WagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
});

//@TODO: change rainbow theme colors
const rainbowTheme = lightTheme({
  accentColor: '',
  accentColorForeground: '',
  borderRadius: 'medium',
  fontStack: 'rounded'
});

const rainbowDisclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the <Link href="#">Terms of Service</Link> and
    acknowledge you have read and understand the protocol <Link href="#">Disclaimer</Link>
  </Text>
);

const rainbowAppInfo = {
  appName: 'WorkAurora',
  disclaimer: rainbowDisclaimer
};

export { WagmiClient, chains, chain, rainbowTheme, rainbowAppInfo };
