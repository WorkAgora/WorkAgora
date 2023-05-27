import { Box, Button, Flex, SimpleGrid } from '@chakra-ui/react';
import FreelanceCard from '../../../card/FreelanceCard';
import { FC } from 'react';
import { useRouter } from 'next/router';

const offers = [1, 2, 3, 4];

const badges: any[] = [
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
  const { push } = useRouter();

  const handleFreelanceCardClick = (id: number) => {
    push(`/dashboard/offer/${id}`);
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
