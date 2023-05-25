import { Flex, Box } from '@chakra-ui/react';
import { FC } from 'react';

const ProfileCompletedJobs: FC = () => {
  return (
    <Flex
      flexDir="column"
      w="100%"
      bgColor="neutral.white"
      px={8}
      py={6}
      gap={4}
      borderRadius="64px"
    >
      <Box textStyle="h4" as="span">
        Completed Jobs
      </Box>
      <Box textStyle="body2" as="span" textAlign="center">
        No completed jobs available
      </Box>
    </Flex>
  );
};

export default ProfileCompletedJobs;
