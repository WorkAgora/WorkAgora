import { useDisconnect, useSignMessage } from 'wagmi';
import { API_URL } from '../services/api';
import { SiweMessage } from 'siwe';
import { getNonceApi, signUpWithEthereumApi } from '../services/auth';
import { useCallback } from 'react';

interface SigupProps {
  address: `0x${string}`;
  chain: { id: number; unsupported?: boolean };
  email: string;
  firstname: string;
  lastname: string;
  userType: string;
  agreeTOS: boolean;
  agreeDataTreatment: boolean;
}

export function useSignUp() {
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const signUp = useCallback(
    async ({
      address,
      chain,
      email,
      firstname,
      lastname,
      userType,
      agreeTOS,
      agreeDataTreatment
    }: SigupProps) => {
      if (address && chain) {
        try {
          const nonce = await getNonceApi(address);
          const message = new SiweMessage({
            domain: window.location.host,
            address,
            statement: 'Sign Up in WorkAurora',
            uri: API_URL,
            version: '1',
            chainId: chain.id,
            expirationTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
            nonce
          }).prepareMessage();
          const signature = await signMessageAsync({ message });
          return await signUpWithEthereumApi({
            message,
            signature,
            wallet: address,
            email,
            firstname,
            lastname,
            userType,
            agreeTOS,
            agreeDataTreatment
          });
        } catch (error) {
          disconnect();
        }
      }
    },
    [disconnect, signMessageAsync]
  );

  return { signUp };
}
