import { Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMenu from '../../../components/dashboard/menu/DashboardMenu';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useEffect } from 'react';
import Profile from '../../../components/freelance/Profile';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Footer from '../../../components/landing/footer/Footer';

const FreelanceProfile: NextPage = () => {
  const { handleScroll, setHasScroll } = useLanding();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setHasScroll(false);
  }, []);

  return (
    <DashboardLayout>
      <PerfectScrollbar
        options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
        style={{
          width: '100%'
        }}
        onScrollY={handleScroll}
      >
        <Flex w={{base: "100vw", lg: "calc(100vw - 245px)"}} ml="auto">
          {id && typeof id === 'string' && <Profile wallet={id} />}
        </Flex>
        <Flex bgColor="neutral.white" mt={8}>
          <Footer />
        </Flex>
      </PerfectScrollbar>
    </DashboardLayout>
  );
};

export default FreelanceProfile;
