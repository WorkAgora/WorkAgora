import { Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useCurrentUser } from '@workagora/front-provider';
import Product from '../components/landing/product/Product';
import Technology from '../components/landing/technology/Technology';

const Home: NextPage = () => {
  const { user } = useCurrentUser();

  let content = (
    <>
      <Product />
      <Technology />
    </>
  );

  if (user) {
    content = <>{JSON.stringify(user)}</>;
  }

  return <Flex flexDir="column">{content}</Flex>;
};

export default Home;
