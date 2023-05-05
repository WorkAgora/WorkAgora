import { Box, Button, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import ProductIllustration from '../../../illustration/ProductIllustration';
import DarkBrandLogo from '../../../logo/DarkBrandLogo';

const ProductCompany: FC = () => {
  const { setSignupModalOpen } = useLanding();

  return (
    <Flex w="100%" justifyContent="space-between">
      <Box maxW="500px" maxH="500px" w="100%" h="100%">
        <ProductIllustration />
      </Box>
      <Flex flexDir="column" justifyContent="center" alignItems="end">
        <Flex alignItems="center">
          <Box textStyle="h1" as="h1" display="inline" whiteSpace="pre-wrap" textAlign="right">
            {`Welcome to the\nkingdom of talents`}
          </Box>
          <Box maxW="100px" maxH="100px" w="100%" h="100%" ml={6}>
            <DarkBrandLogo />
          </Box>
        </Flex>
        <Box textStyle="text" as="span" display="inline" textAlign="right" mt={6}>
          The future is bright
        </Box>
        <Box mt={4}>
          <Button
            variant="secondary"
            rightIcon={<ArrowRightIcon />}
            onClick={() => setSignupModalOpen(true)}
          >
            Try for free
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ProductCompany;
