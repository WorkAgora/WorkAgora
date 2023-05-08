import { Box, Flex } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import { FC } from 'react';

const DashboardFreelance: FC = () => {
  const { user } = useCurrentUser();

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%">
      <Flex
        flexDir="column"
        w="100%"
        h="100%"
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={8}
        borderRadius="64px"
      >
        <Box textStyle="h2" as="h1" w="100%" textAlign="center">
          {`Welcome home ${user?.firstname} ${user?.lastname}`}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardFreelance;
