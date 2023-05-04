import { Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useCurrentUser } from '@workagora/front-provider';
import Product from '../components/landing/Product';

const Home: NextPage = () => {
  const { user } = useCurrentUser();

  return (
    <Flex flexDir="column">
      <Product />
    </Flex>
  );
};

export default Home;
