import { Box, Button, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import ProductIllustration from '../../../illustration/ProductIllustration';
import LightBrandLogo from '../../../logo/LightBrandLogo';

const ProductFreelance: FC = () => {
  const { setSignupModalOpen } = useLanding();

  return (
    <Flex w="100%" justifyContent="space-between">
      <Flex flexDir="column" justifyContent="center" alignItems="start">
        <Flex alignItems="center">
          <Box maxW="100px" maxH="100px" w="100%" h="100%" mr={6}>
            <LightBrandLogo />
          </Box>
          <Box textStyle="h1" as="h1" display="inline" whiteSpace="pre-wrap" textAlign="left">
            {`Find a mission has\nnever been easier`}
          </Box>
        </Flex>
        <Box textStyle="text" as="span" display="inline" textAlign="right" mt={6}>
          The future is bright
        </Box>
        <Box mt={4}>
          <Button
            variant="primary"
            rightIcon={<ArrowRightIcon />}
            onClick={() => setSignupModalOpen(true)}
          >
            Try for free
          </Button>
        </Box>
      </Flex>
      <Box maxW="500px" maxH="500px" w="100%" h="100%">
        <ProductIllustration />
      </Box>
    </Flex>
  );
};

export default ProductFreelance;
