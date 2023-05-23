import { Flex } from '@chakra-ui/react';
import { useDashboard, useLanding } from '@workagora/front-provider';
import { NextPage } from 'next';
import DashboardMenu from '../../../components/dashboard/menu/DashboardMenu';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ReactNode, useEffect, useState } from 'react';
import { UserTypeEnum } from '@workagora/utils';
import OfferDetail from '../../../components/offer/OfferDetail';
import { SearchBarFilter } from '../../../components/landing/product/SearchBar';

const badges: SearchBarFilter[] = [
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
  const { setView } = useDashboard();
  const [content, setContent] = useState<ReactNode>(<>{id}</>);

  useEffect(() => {
    setHasScroll(false);
    setView('offers');
  }, []);

  useEffect(() => {
    if (type === UserTypeEnum.Freelancer) {
      setContent(<OfferDetail badges={badges} />);
    }
  }, [type]);

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

export default OfferWithId;
