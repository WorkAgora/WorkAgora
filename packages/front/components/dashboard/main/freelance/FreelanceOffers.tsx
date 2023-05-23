import { Box, Button, Flex, SimpleGrid } from '@chakra-ui/react';
import FreelanceCard from '../../../card/FreelanceCard';
import { SearchBarFilter } from '../../../landing/product/SearchBar';
import { FC } from 'react';
import { useDashboard } from '@workagora/front-provider';
import { useRouter } from 'next/router';

const offers = [1, 2, 3, 4];

const badges: SearchBarFilter[] = [
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

const FreelanceOffers: FC = () => {
  const { view, setView } = useDashboard();
  const { push } = useRouter();

  const handleFreelanceCardClick = (id: number) => {
    if (view !== 'offers') {
      setView('offers');
      push(`/dashboard/offer/${id}`);
    }
  };
  return (
    <Flex flexDir="column" gap={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box textStyle="h4" as="h3" color="neutral.black">
          Other jobs that match your interests
        </Box>
        <Box>
          <Button variant="link" p={0}>
            See more
          </Button>
        </Box>
      </Flex>
      <Flex flexDir="column">
        <SimpleGrid columns={2} spacing={8} w="100%">
          {/*offers.map((v, k) => (
            <FreelanceCard key={k} badges={badges} onClick={handleFreelanceCardClick} />
          ))*/}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export default FreelanceOffers;
