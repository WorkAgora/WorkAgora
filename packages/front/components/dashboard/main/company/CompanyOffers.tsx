import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import FreelanceInlineCard from '../../../card/FreelanceInlineCard';
import { SearchBarFilter } from '../../../landing/product/SearchBar';
import { useRecentFreelancer } from '../../../../hooks/useRecentFreelancer';
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
  const { freelancers, loading } = useRecentFreelancer({ limit: 4 });

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

      {loading && (
        <Flex flexDir="column" justifyContent="center" alignItems="center" my={16}>
          <Spinner color="brand.primary" size="xl" mx="auto" />
          <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
            Loading Offers
          </Box>
        </Flex>
      )}
      {!loading && (
        <Flex flexDir="column" gap={2}>
          {' '}
          {freelancers.map((v, k) => (
            <FreelanceInlineCard key={k} user={v} />
          ))}{' '}
        </Flex>
      )}
    </Flex>
  );
};

export default CompanyOffers;
