import { useToast, Text } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Chain, useAccount, useNetwork } from 'wagmi';
import { useConnect } from './useConnect';
import { CurrentUserContext } from './useCurrentUser';

export const useLogin = (signupModalOpen: boolean) => {
  const { user, setUser } = useContext(CurrentUserContext);
  const { signIn } = useConnect();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async ({ address, chain }: { address: `0x${string}`; chain: Chain }) => {
      setIsLoading(true);
      const res = await signIn({ address, chain });
      if (typeof res !== 'string') {
        console.log(res);
        setUser(res);
      } else {
        toast({
          title: <Text mt={-0.5}>Error while login</Text>,
          description: typeof res === 'string' ? res : null,
          status: 'error',
          isClosable: true,
          position: 'top-right'
        });
      }
      setIsLoading(false);
    },
    [signIn, toast]
  );

  useEffect(() => {
    if (!signupModalOpen && !user) {
      if (isConnected && address && chain) {
        login({ address, chain });
      }
    }
  }, [address, chain, isConnected, login, signupModalOpen, user]);

  return { isLoading };
};
