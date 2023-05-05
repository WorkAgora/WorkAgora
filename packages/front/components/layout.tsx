import { Container, Flex, Spinner } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import Cookies from 'js-cookie';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDisconnect } from 'wagmi';
import { checkUserLogged } from '../services/user';
import SignupForm from './form/SignupForm';
import SignupModal from './modal/SignupModal';

export const Layout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const { user, setUser } = useCurrentUser();
  const { disconnect } = useDisconnect();
  const { signupModalOpen, setSignupModalOpen } = useLanding();
  const [isFetching, setIsFetching] = useState(true);
  const authenticatedCookie = Cookies.get('authenticated');

  const isUserLogged = useCallback(async () => {
    const res = await checkUserLogged();
    console.log(res);
    if (res) {
      if (!user) {
        setUser(res);
      }
    }
    setIsFetching(false);
  }, [setUser, user]);

  useEffect(() => {
    if (authenticatedCookie === 'true' && !user) {
      setIsFetching(true);
      isUserLogged();
    } else {
      setIsFetching(false);
    }
  }, [isUserLogged, user, authenticatedCookie]);

  return (
    <Container
      maxW="100vw"
      minW="100vw"
      minH="100vh"
      w="100vw"
      h="100vh"
      p="0"
      display="flex"
      flexDir="column"
      overflow="hidden"
      position="relative"
      bgColor="neutral.lightGray"
      color="neutral.black"
    >
      <Flex
        w="100vw"
        h="100vh"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        visibility={isFetching ? 'visible' : 'hidden'}
        opacity={isFetching ? 1 : 0}
        bgColor="neutral.lightGray"
        position="absolute"
        zIndex="9999"
        transition="all ease-in-out 200ms"
      >
        <Spinner size="xl" color="brand.primary" mt={8} />
      </Flex>
      {!user && !isFetching && (
        <SignupModal
          isOpen={signupModalOpen}
          onClose={() => {
            disconnect();
            setTimeout(() => {
              setSignupModalOpen(false);
            }, 200);
          }}
          title="Sign up"
        >
          <SignupForm
            onSubmitSuccess={() => {
              disconnect();
              setTimeout(() => {
                setSignupModalOpen(false);
              }, 200);
            }}
          />
        </SignupModal>
      )}
      {children}
    </Container>
  );
};

export default Layout;
