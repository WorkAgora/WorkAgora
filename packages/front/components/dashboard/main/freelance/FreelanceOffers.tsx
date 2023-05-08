import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';

const FreelanceOffers: FC = () => {
  return (
    <Flex flexDir="column">
      <Box textStyle="h4" as="h3" color="neutral.black">
        Some offers that might interest you
      </Box>
    </Flex>
  );
};

export default FreelanceOffers;
