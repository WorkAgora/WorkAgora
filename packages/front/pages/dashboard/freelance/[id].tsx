import { Flex } from '@chakra-ui/react';
import { useDashboard, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMenu from '../../../components/dashboard/menu/DashboardMenu';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ReactNode, useEffect, useState } from 'react';
import Profile from '@workagora/front/components/freelance/Profile';
import { useRouter } from 'next/router';

const FreelanceProfile: NextPage = () => {
  const { type, handleScroll, setHasScroll } = useLanding();
  const { setView } = useDashboard();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setHasScroll(false);
    setView('offers');
  }, []);

  console.log(id);

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
            <Profile wallet={id} />
          </PerfectScrollbar>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FreelanceProfile;
