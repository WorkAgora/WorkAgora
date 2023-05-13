import { Flex } from '@chakra-ui/react';
import { DashboardProvider, useDashboard, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMain from '../components/dashboard/main/DashboardMain';
import DashboardMenu from '../components/dashboard/menu/DashboardMenu';
import DashboardOffers from '../components/dashboard/offers/DashboardOffers';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ReactNode, useEffect, useState } from 'react';

const Dashboard: NextPage = () => {
  const { view } = useDashboard();
  const { type, handleScroll } = useLanding();
  const [content, setContent] = useState<ReactNode>(<></>);

  useEffect(() => {
    console.log(view);
    switch (view) {
      case 'dashboard':
        setContent(<DashboardMain />)
        break;
      case 'offers':
        setContent(<DashboardOffers />)
        break;
    }
  }, [view])

  return (
 
      <Flex flexDir="column" w="100%" mt="80px" h={`calc(100vh - 80px)`}>
        <Flex w="100%" h="100%" position="relative">
          <DashboardMenu />

          <Flex w="calc(100vw - 245px)" ml="auto" maxHeight="100%">
            <PerfectScrollbar
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
