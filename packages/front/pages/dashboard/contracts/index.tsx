import { useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import { useRef } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DashboardContracts from '../../../components/dashboard/contracts/DashboardContracts';
import Footer from '@workagora/front/components/landing/footer/Footer';
import { Flex } from '@chakra-ui/react';

const DashboardContractsPage: NextPage = () => {
  const { handleScroll } = useLanding();
  const scrollbarRef = useRef<HTMLElement | null>(null);

  return (
    <DashboardLayout>
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
        <Flex w={{base: "100vw", lg: "calc(100vw - 245px)"}} ml="auto">
          <DashboardContracts />
        </Flex>
        <Flex bgColor="neutral.white" mt={8}>
          <Footer />
        </Flex>
      </PerfectScrollbar>
    </DashboardLayout>
  );
};

export default DashboardContractsPage;
