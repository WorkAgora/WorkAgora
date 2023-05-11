import { Box } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { UserTypeEnum } from '@workagora/utils';
import { FC } from 'react';
import ProductIllustrationCompany from './company/ProductIllustrationCompany';
import ProductIllustrationFreelance from './freelance/ProductIllustrationFreelance';

const ProductIllustration: FC = () => {
  const { type } = useLanding();

  let illustration = <></>;
  if (type == UserTypeEnum.Freelancer) {
    illustration = <ProductIllustrationFreelance />;
  }
  if (type === UserTypeEnum.Company) {
    illustration = <ProductIllustrationCompany />;
  }

  return (
    <Box maxW="500px" maxH="500px" w="100%" h="100%">
      {illustration}
    </Box>
  );
};

export default ProductIllustration;
