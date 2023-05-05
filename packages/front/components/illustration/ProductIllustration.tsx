import { Box } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import ProductIllustrationCompany from './company/ProductIllustrationCompany';
import ProductIllustrationFreelance from './freelance/ProductIllustrationFreelance';

const ProductIllustration: FC = () => {
  const { type, possibleType } = useLanding();

  let illustration = <></>;
  if (type == possibleType[0]) {
    illustration = <ProductIllustrationFreelance />;
  }
  if (type === possibleType[1]) {
    illustration = <ProductIllustrationCompany />;
  }

  return (
    <Box maxW="500px" maxH="500px" w="100%" h="100%">
      {illustration}
    </Box>
  );
};

export default ProductIllustration;
