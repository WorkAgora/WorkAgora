import { Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import ProductCompany from './company/ProductCompany';
import ProductFreelance from './freelance/ProductFreelance';
import { InView } from 'react-intersection-observer';
import SearchBar from './SearchBar';
import Gallery from './Gallery';
import Partners from './Partners';

const Product: FC = () => {
  const { type, possibleType, handleViewChange } = useLanding();

  let topContent = <></>;

  if (type == possibleType[0]) {
    topContent = <ProductFreelance />;
  }

  if (type == possibleType[1]) {
    topContent = <ProductCompany />;
  }

  return (
    <InView
      as="div"
      id="product"
      onChange={handleViewChange}
      threshold={[0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
    >
      <Flex flexDir="column" pt={16}>
        <Flex mx="auto" width="80%" maxW="1280px" flexDir="column">
          {topContent}
          <SearchBar />
          <Gallery mt={8} />
        </Flex>
        <Partners mt={16} />
      </Flex>
    </InView>
  );
};

export default Product;
