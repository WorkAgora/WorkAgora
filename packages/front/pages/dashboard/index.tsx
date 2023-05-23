import { Flex } from '@chakra-ui/react';
import { useCurrentUser, useDashboard, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMain from '../../components/dashboard/main/DashboardMain';
import DashboardMenu from '../../components/dashboard/menu/DashboardMenu';
import DashboardOffers from '../../components/dashboard/offers/DashboardOffers';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ReactNode, useEffect, useRef, useState } from 'react';
import DashboardProfile from '../../components/dashboard/profile/DashboardProfile';
import { UserTypeEnum } from '@workagora/utils';

const Dashboard: NextPage = () => {
  const { view } = useDashboard();
  const { user } = useCurrentUser();
  const { type, setType, handleScroll } = useLanding();
  const [content, setContent] = useState<ReactNode>(<></>);
  const scrollbarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (user) {
      setType(user.currentUserType as UserTypeEnum);
    }
  }, [setType, user]);

  useEffect(() => {
    switch (view) {
      case 'profile':
        setContent(<DashboardProfile />);
        break;
      case 'dashboard':
        setContent(<DashboardMain />);
        break;
      case 'offers':
        setContent(<DashboardOffers scrollbarRef={scrollbarRef} />);
        break;
    }
  }, [view]);

  return (
    <Flex flexDir="column" w="100%" mt="80px" h={`calc(100vh - 80px)`}>
      <Flex w="100%" h="100%" position="relative">
        <DashboardMenu />

        <Flex w="calc(100vw - 245px)" ml="auto" maxHeight="100%">
          <PerfectScrollbar
            containerRef={(el) => {
              scrollbarRef.current = el;
            }}
            options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
            style={{
              width: '100%'
            }}
            onScrollY={handleScroll}
          >
            {content}
          </PerfectScrollbar>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
