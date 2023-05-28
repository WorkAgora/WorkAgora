import { Flex, SimpleGrid } from '@chakra-ui/react';
import { useJobs } from '@workagora/front-provider';
import JobCard from '@workagora/front/components/card/JobCard';
import { FC } from 'react';

const CompanyGallery: FC = () => {
  const { jobs } = useJobs();
  return (
    <Flex flexDir="column">
      <SimpleGrid columns={2} spacing={8} w="100%">
        {jobs?.map((j, k) => (
          <JobCard job={j} key={k} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default CompanyGallery;
