import { Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useEffect } from 'react';
import OfferDetail from '../../../components/offer/OfferDetail';
import Footer from '../../../components/landing/footer/Footer';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useRouter } from 'next/router';

const OfferWithId: NextPage = () => {
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
          <OfferDetail id={id as string} />
        </Flex>
        <Flex bgColor="neutral.white" mt={8}>
          <Footer />
        </Flex>
      </PerfectScrollbar>
    </DashboardLayout>
  );
};

export default OfferWithId;
