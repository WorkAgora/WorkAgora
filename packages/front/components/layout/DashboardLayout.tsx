import { Flex } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMenu from '../dashboard/menu/DashboardMenu';
import { ReactNode, useEffect } from 'react';
import { UserTypeEnum } from '@workagora/utils';
import Footer from '../landing/footer/Footer';

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
        {children}
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
