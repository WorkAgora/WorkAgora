import { Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ReactNode, useEffect, useState } from 'react';
import { UserTypeEnum } from '@workagora/utils';
import OfferDetail from '../../../components/offer/OfferDetail';
import Footer from '../../../components/landing/footer/Footer';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const badges: any[] = [
  { label: 'Remote work', bgColor: 'neutral.gray', color: 'neutral.black' },
  { label: 'Full time', bgColor: 'neutral.gray', color: 'neutral.black' },
  { label: '3 months mission', bgColor: 'neutral.gray', color: 'neutral.black' },
  {
    label: 'Product',
    bgColor: 'badge.yellow',
    color: 'neutral.black'
  },
  {
    label: 'Design',
    bgColor: 'badge.blue',
    color: 'neutral.white'
  },
  {
    label: 'UI/UX',
    bgColor: 'badge.red',
    color: 'neutral.white'
  },
  {
    label: 'Figma',
    bgColor: 'badge.purple',
    color: 'neutral.white'
  }
];

const OfferWithId: NextPage<{ id: number }> = ({ id }) => {
  const { type, handleScroll, setHasScroll } = useLanding();
  const [content, setContent] = useState<ReactNode>(<>{id}</>);

  useEffect(() => {
    setHasScroll(false);
  }, []);

  useEffect(() => {
    if (type === UserTypeEnum.Freelancer) {
      setContent(<OfferDetail badges={badges} />);
    }
  }, [type]);

  return (
    <DashboardLayout>
      <PerfectScrollbar
        options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
        style={{
          width: '100%'
        }}
        onScrollY={handleScroll}
      >
        <Flex w="calc(100vw - 245px)" ml="auto">
          {content}
        </Flex>
        <Flex bgColor="neutral.white" mt={8}>
          <Footer />
        </Flex>
      </PerfectScrollbar>
    </DashboardLayout>
  );
};

export default OfferWithId;
