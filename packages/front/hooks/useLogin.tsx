import { useToast, Text } from '@chakra-ui/react';
import { CurrentUserContext, useLanding } from '@workagora/front-provider';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Chain, useAccount, useNetwork } from 'wagmi';
import { useConnect } from './useConnect';

export const useLogin = (signupModalOpen: boolean) => {
  const { user, setUser } = useContext(CurrentUserContext);
  const { signIn } = useConnect();
  const { setType } = useLanding();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async ({ address, chain }: { address: `0x${string}`; chain: Chain }) => {
      setIsLoading(true);
      const res = await signIn({ address, chain });
      if (typeof res !== 'string') {
        setUser(res);
        setType(res.currentUserType);
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
    [setType, setUser, signIn, toast]
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
