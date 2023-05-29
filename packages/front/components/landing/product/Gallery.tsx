import { Box, Button, Flex, SimpleGrid, SimpleGridProps, Spinner } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC, useEffect, useState } from 'react';
import FreelanceCard from '../../card/FreelanceCard';
import { UserTypeEnum } from '@workagora/utils';
import { useRecentFreelancer } from '@workagora/front/hooks/useRecentFreelancer';
import { useSearchFreelancer } from '@workagora/front/hooks/useSearchFreelancer';
import { useRecentJob } from '@workagora/front/hooks/useRecentJob';
import JobCard from '../../card/JobCard';

const Gallery: FC<SimpleGridProps> = ({ ...props }: SimpleGridProps) => {
  const { type, setSignupModalOpen } = useLanding();
  const [caption, setCaption] = useState<string>('');
  const recentFreelancer = useRecentFreelancer({ limit: 8 });
  const recentJob = useRecentJob({ limit: 8 });
  const searchFreelance = useSearchFreelancer(8);

  useEffect(() => {
    if (type === UserTypeEnum.Freelancer) {
      setCaption('Join us and find your perfect offer');
    }
    if (type === UserTypeEnum.Company) {
      setCaption('Join us and find your perfect freelancer');
    }
  }, [type]);

  return (
    <Flex w="100%" flexDir="column" position="relative" pb={6}>
      {type == UserTypeEnum.Company && recentFreelancer.loading && (
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          my={16}
          w="100%"
          position="relative"
        >
          <Spinner color="brand.primary" size="xl" mx="auto" />
          <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
            Loading Offers
          </Box>
        </Flex>
      )}
      {type == UserTypeEnum.Company && !recentFreelancer.loading && (
        <SimpleGrid
          columns={2}
          spacing={8}
          w="100%"
          position="relative"
          zIndex="1"
          pb={16}
          {...props}
        >
          {searchFreelance.searchFilters.length === 0 &&
            recentFreelancer.freelancers.map((v, k) => (
              <FreelanceCard key={k} user={v} blurred={k >= 6} />
            ))}
          {searchFreelance.searchFilters.length > 0 &&
            searchFreelance.freelancers.map((v, k) => (
              <FreelanceCard
                key={k}
                user={v}
                blurred={
                  searchFreelance.freelancers.length % 2 === 0
                    ? k >= searchFreelance.freelancers.length - 2
                    : k >= searchFreelance.freelancers.length - 1
                }
              />
            ))}
        </SimpleGrid>
      )}
      {type == UserTypeEnum.Freelancer && recentJob.loading && (
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          my={16}
          w="100%"
          position="relative"
        >
          <Spinner color="brand.primary" size="xl" mx="auto" />
          <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
            Loading Jobs
          </Box>
        </Flex>
      )}
      {type == UserTypeEnum.Freelancer && !recentJob.loading && (
        <SimpleGrid
          columns={2}
          spacing={8}
          w="100%"
          position="relative"
          zIndex="1"
          pb={16}
          {...props}
        >
          {searchFreelance.searchFilters.length === 0 &&
            recentJob.jobs.map((v, k) => <JobCard key={k} job={v} blurred={k >= 6} />)}
          {searchFreelance.searchFilters.length > 0 &&
            searchFreelance.freelancers.map((v, k) => (
              <FreelanceCard
                key={k}
                user={v}
                blurred={
                  searchFreelance.freelancers.length % 2 === 0
                    ? k >= searchFreelance.freelancers.length - 2
                    : k >= searchFreelance.freelancers.length - 1
                }
              />
            ))}
        </SimpleGrid>
      )}
      <Flex
        flexDir="column"
        justifyContent="end"
        pb={4}
        alignItems="center"
        w="100%"
        position="absolute"
        zIndex="2"
        bottom={recentFreelancer.loading || recentJob.loading ? '-50' : '0'}
      >
        <Box textStyle="h3" as="h3" w="100%" textAlign="center" cursor="default">
          {caption}
        </Box>
        <Box mt={4}>
          <Button variant="primary" size="md" onClick={() => setSignupModalOpen(true)}>
            Sign up
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Gallery;
