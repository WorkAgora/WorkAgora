import { Box, Button, Flex, SimpleGrid, Spinner } from '@chakra-ui/react';
import FreelanceInlineCard from '../../../card/FreelanceInlineCard';
import { useRecentFreelancer } from '../../../../hooks/useRecentFreelancer';
import { FC } from 'react';

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
          <SimpleGrid columns={1} spacing={2} w="100%">
            {freelancers.map((v, k) => (
              <FreelanceInlineCard key={k} user={v} />
            ))}
          </SimpleGrid>
        </Flex>
      )}
    </Flex>
  );
};

export default CompanyOffers;
