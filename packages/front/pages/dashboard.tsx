import { Flex } from '@chakra-ui/react';
import { DashboardProvider, useDashboard, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMain from '../components/dashboard/main/DashboardMain';
import DashboardMenu from '../components/dashboard/menu/DashboardMenu';

const Dashboard: NextPage = () => {
  const { view } = useDashboard();
  const { type, possibleType } = useLanding();

  let content = <></>;

  switch (view) {
    case 'dashboard':
      content = <DashboardMain />;
      break;
  }

  return (
    <DashboardProvider>
      <Flex flexDir="column" w="100%" mt="80px" h={`calc(100vh - 80px)`}>
        <Flex w="100%" h="100%">
          <DashboardMenu />
          {content}
        </Flex>
      </Flex>
    </DashboardProvider>
  );
};

export default Dashboard;
