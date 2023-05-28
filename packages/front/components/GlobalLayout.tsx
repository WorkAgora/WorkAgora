import { Container } from '@chakra-ui/react';
import { useCurrentCompany, useCurrentUser, useLanding } from '@workagora/front-provider';
import Cookies from 'js-cookie';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { checkUserLogged } from '../services/user';
import Header from './header/Header';
import SignupModal from './modal/SignupModal';
import { useRouter } from 'next/router';
import { getMyCompanies } from '../services/company';
import { UserTypeEnum } from '@workagora/utils';

export const GlobalLayout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const { user, setUser, setFetchingUser } = useCurrentUser();
  const { setCompany, setFetching, fetching } = useCurrentCompany();
  const { type } = useLanding();
  const [isFetching, setIsFetching] = useState(true);
  const authenticatedCookie = Cookies.get('authenticated');
  const { pathname, push } = useRouter();

  const isUserLogged = useCallback(async () => {
    const res = await checkUserLogged();
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
      setFetchingUser(true);
      isUserLogged();
    }
    if (!authenticatedCookie) {
      if (pathname !== '/') {
        push('/');
      }
      setFetchingUser(false);
      setIsFetching(false);
    }
  }, [isUserLogged, user, authenticatedCookie, pathname, push, setFetchingUser]);

  const getCompany = useCallback(async () => {
    const res = await getMyCompanies();
    setCompany(res);
    setFetching(false);
  }, [setCompany, setFetching]);

  useEffect(() => {
    if (type === UserTypeEnum.Company) {
      if (!fetching) {
        setFetching(true);
        getCompany();
      }
    }
  }, [getCompany, setFetching, type]);

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
      <Header />
      {children}
    </Container>
  );
};

export default GlobalLayout;
