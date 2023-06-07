import { Box, Flex, SimpleGrid, Spinner } from '@chakra-ui/react';
import { useJobs } from '@workagora/front-provider';
import JobCard from '@workagora/front/components/card/JobCard';
import { useRouter } from 'next/router';
import { FC } from 'react';

const CompanyGallery: FC = () => {
  const { jobs, jobsFetching } = useJobs();
  const { push } = useRouter();

  return (
    <Flex flexDir="column">
      {!jobsFetching && (
        <>
          {jobs && jobs?.length > 0 && (
            <SimpleGrid columns={{base: 1, lg: 2}} spacing={8} w="100%">
              {jobs?.map((j, k) => (
                <JobCard job={j} key={k} onClick={(id) => push(`/dashboard/offers/${id}`)} />
              ))}
            </SimpleGrid>
          )}
          {!jobs ||
            (jobs.length === 0 && (
              <Box
                textStyle="body2"
                as="span"
                textAlign="center"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              >
                No jobs available
              </Box>
            ))}
        </>
      )}
      {jobsFetching && (
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          my={16}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%;-50%)"
        >
          <Spinner color="brand.primary" size="xl" mx="auto" />
          <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
            Loading Jobs
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default CompanyGallery;
