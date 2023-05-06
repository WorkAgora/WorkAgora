import { Container } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import Cookies from 'js-cookie';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { checkUserLogged } from '../services/user';
import Header from './header/Header';
import SignupModal from './modal/SignupModal';
import PerfectScrollbar from 'react-perfect-scrollbar';

export const Layout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const { user, setUser } = useCurrentUser();
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
      {!user && !isFetching && <SignupModal />}
      <PerfectScrollbar options={{ suppressScrollX: true, maxScrollbarLength: 160 }}>
        <Header />
        {children}
      </PerfectScrollbar>
    </Container>
  );
};

export default Layout;
