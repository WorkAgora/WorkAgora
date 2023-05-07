import { Box, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { InView } from 'react-intersection-observer';

const Technology: FC = () => {
  const { type, possibleType, handleViewChange } = useLanding();

  return (
    <InView as="div" id="technology" onChange={handleViewChange}>
      <Flex flexDir="column" pt={16}>
        <Flex mx="auto" width="80%" maxW="1280px" flexDir="column">
          <Box textStyle="h2" textAlign="center" whiteSpace="pre-wrap">
            {`Here is why you need\nWorkAgora`}
          </Box>
        </Flex>
      </Flex>
    </InView>
  );
};

export default Technology;
