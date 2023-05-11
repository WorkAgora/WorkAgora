import { Box, Button, Flex } from '@chakra-ui/react';
import FreelanceInlineCard from '@workagora/front/components/card/FreelanceInlineCard';
import { SearchBarFilter } from '@workagora/front/components/landing/product/SearchBar';
import { FC } from 'react';

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

const CompanyOffers: FC = () => {
  return (
    <Flex flexDir="column" gap={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box textStyle="h4" as="h3" color="neutral.black">
          Some offers that might interest you
        </Box>
        <Box>
          <Button variant="link" p={0}>
            See more
          </Button>
        </Box>
      </Flex>
      <Flex flexDir="column" gap={2}>
        {offers.map((v, k) => (
          <FreelanceInlineCard key={k} badges={badges} />
        ))}
      </Flex>
    </Flex>
  );
};

export default CompanyOffers;
