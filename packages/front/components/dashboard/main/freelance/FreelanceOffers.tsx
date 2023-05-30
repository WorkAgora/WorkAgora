import { Box, Button, Flex, SimpleGrid, Spinner } from '@chakra-ui/react';
import FreelanceCard from '../../../card/FreelanceCard';
import { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchJob } from '@workagora/front/hooks/useSearchJob';
import { useCurrentUser } from '@workagora/front-provider';
import { useRecentJob } from '@workagora/front/hooks/useRecentJob';
import JobCard from '@workagora/front/components/card/JobCard';

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
  const { user } = useCurrentUser();
  const { jobs, loading, handleSearch } = useSearchJob();
  const recentJob = useRecentJob({ limit: 2 });

  const handleJobCardClick = (id: string) => {
    push(`/dashboard/offers/${id}`);
  };

  useEffect(() => {
    if (user && user.freelanceProfile?.skills) {
      handleSearch(1, 2, user.freelanceProfile.skills);
    }
  }, [user]);

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
      {loading && (
        <Flex flexDir="column" justifyContent="center" alignItems="center" my={16}>
          <Spinner color="brand.primary" size="xl" mx="auto" />
          <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
            Loading Offers
          </Box>
        </Flex>
      )}
      {!loading && (
        <Flex flexDir="column">
          <SimpleGrid columns={2} spacing={8} w="100%">
            {jobs &&
              jobs?.length > 0 &&
              jobs.map((j, k) => <JobCard job={j} key={k} onClick={handleJobCardClick} />)}
            {(jobs && jobs.length === 0) ||
              (!jobs &&
                recentJob.jobs.map((j, k) => (
                  <JobCard job={j} key={k} onClick={handleJobCardClick} />
                )))}
          </SimpleGrid>
        </Flex>
      )}
    </Flex>
  );
};

export default FreelanceOffers;
