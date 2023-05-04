import { Flex, Spinner } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import Cookies from 'js-cookie';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { checkUserLogged } from '../services/user';

export const Layout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const { user, setUser } = useCurrentUser();
  const [isFetching, setIsFetching] = useState(false);

  const isUserLogged = useCallback(async () => {
    const res = await checkUserLogged();
    console.log(res);
    if (res) {
      if (!user) {
        setUser(res);
      }
    }
    setIsFetching(false);
  }, []);

  useEffect(() => {
    if (Cookies.get('authenticated') === 'true' && !user) {
      setIsFetching(true);
      isUserLogged();
    }
  }, [isUserLogged, user]);

  return (
    <>
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
      {children}
    </>
  );
};

export default Layout;
