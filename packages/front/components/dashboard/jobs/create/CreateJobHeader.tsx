import { Button, Box, Flex } from '@chakra-ui/react';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import { FC } from 'react';
import { useRouter } from 'next/router';

const CreateJobHeader: FC = () => {
  const { push } = useRouter();

  return (
    <Flex flexDir={{base: 'column', lg: 'row'}}>
      <Box textStyle="h2" as="h1" w="100%" textAlign="left">
        Create New Job
      </Box>
      <Box>
        <Button
          variant="outline"
          leftIcon={
            <Box transform="rotate(-180deg)">
              <ArrowRightIcon />
            </Box>
          }
          onClick={() => push('/dashboard/jobs')}
        >
          Back to your jobs
        </Button>
      </Box>
    </Flex>
  );
};

export default CreateJobHeader;
