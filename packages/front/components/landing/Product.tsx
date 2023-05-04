import { Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import ProductCompany from './company/ProductCompany';
import ProductFreelance from './freelance/ProductFreelance';
import { InView } from 'react-intersection-observer';

const Product: FC = () => {
  const { type, possibleType, handleViewChange } = useLanding();

  let content = <></>;

  if (type == possibleType[0]) {
    content = <ProductFreelance />;
  }

  if (type == possibleType[1]) {
    content = <ProductCompany />;
  }

  return (
    <InView as="div" id="product" onChange={handleViewChange}>
      <Flex id="product" flexDir="column" pt={16}>
        <Flex mx="auto" width="80%">
          {content}
        </Flex>
      </Flex>
    </InView>
  );
};

export default Product;
