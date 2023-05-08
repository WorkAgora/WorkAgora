import { Flex } from '@chakra-ui/react';
import { DashboardProvider, useDashboard, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardFreelance from '../components/dashboard/main/DashboardFreelance';
import DashboardMenu from '../components/dashboard/menu/DashboardMenu';

const Dashboard: NextPage = () => {
  const { view, setView } = useDashboard();
  const { type, possibleType } = useLanding();

  let content = <></>;

  if (type === possibleType[0]) {
    switch (view) {
      case 'dashboard':
        content = <DashboardFreelance />;
        break;
    }
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
