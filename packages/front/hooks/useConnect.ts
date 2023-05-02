import { useDisconnect, useSignMessage } from 'wagmi';
import { API_URL } from '../services/api';
import { SiweMessage } from 'siwe';
import { getNonceApi, signInWithEthereumApi } from '../services/auth';
import { useCallback } from 'react';

interface LoginProps {
  address: `0x${string}`;
  chain: { id: number; unsupported?: boolean };
}

export function useConnect() {
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const signIn = useCallback(
    async ({ address, chain }: LoginProps) => {
      //@TODO: check authtoken
      if (chain.unsupported) return;
      if (address && chain) {
        try {
          const nonce = await getNonceApi(address);
          const message = new SiweMessage({
            domain: window.location.host,
            address,
            statement: 'Sign in WorkAurora',
            uri: API_URL,
            version: '1',
            chainId: chain.id,
            expirationTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
            nonce
          }).prepareMessage();
          const signature = await signMessageAsync({ message });
          const tokens = await signInWithEthereumApi({ message, signature });
          //@TODO create a store or context to keep tokens;
        } catch (error) {
          //@TODO change for logout from all auth not only wallet
          disconnect();
        }
      }
    },
    [disconnect, signMessageAsync]
  );

  return { signIn };
}
