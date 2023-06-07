import { Flex, Spinner } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMenu from '../dashboard/menu/DashboardMenu';
import { ReactNode, useEffect } from 'react';
import { UserTypeEnum } from '@workagora/utils';
import Footer from '../landing/footer/Footer';
import LoadingScreen from '../LoadingScreen';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: NextPage<DashboardLayoutProps> = ({ children }) => {
  const { user } = useCurrentUser();
  const { setType, type } = useLanding();
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();
  
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
        {desktopDisplay && <DashboardMenu />}
        {user && <>{children}</>}
        {!user && (
          <Flex w={{base: "100vw", lg: "calc(100vw - 245px)"}} ml="auto">
            <Flex px={{base: 0, lg: 6}} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
              <Flex
                flexDir="column"
                w="100%"
                flexGrow="1"
                bgColor="neutral.white"
                px={{base: 4, lg: 8}}
                py={{base: 2, lg: 6}}
                gap={{base: 4, lg: 8}}
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
