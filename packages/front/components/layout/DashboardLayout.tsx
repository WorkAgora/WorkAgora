import { Flex, Spinner } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMenu from '../dashboard/menu/DashboardMenu';
import { ReactNode, useEffect } from 'react';
import { UserTypeEnum } from '@workagora/utils';
import Footer from '../landing/footer/Footer';
import LoadingScreen from '../LoadingScreen';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: NextPage<DashboardLayoutProps> = ({ children }) => {
  const { user } = useCurrentUser();
  const { setType, type } = useLanding();

  useEffect(() => {
    if (user) {
      if (type !== user.currentUserType) {
        setType(user.currentUserType as UserTypeEnum);
      }
    }
  }, [user]);

  return (
    <Flex flexDir="column" w="100%" mt="80px" h={`calc(100vh - 80px)`}>
      <Flex w="100%" h="100%" position="relative">
        <DashboardMenu />
        {user && <>{children}</>}
        {!user && (
          <Flex w="calc(100vw - 245px)" ml="auto">
            <Flex px={6} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
              <Flex
                flexDir="column"
                w="100%"
                flexGrow="1"
                bgColor="neutral.white"
                px={8}
                py={6}
                gap={8}
                borderRadius="64px"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner size="xl" color="brand.primary" />
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
