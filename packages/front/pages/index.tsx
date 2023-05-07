import { Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useCurrentUser } from '@workagora/front-provider';
import Product from '../components/landing/product/Product';
import Technology from '../components/landing/technology/Technology';
import Community from '../components/landing/community/Community';
import Contact from '../components/landing/contact/Contact';
import Footer from '../components/landing/footer/Footer';

const Home: NextPage = () => {
  const { user } = useCurrentUser();

  let content = (
    <>
      <Product />
      <Technology />
      <Community />
      <Contact />
      <Footer />
    </>
  );

  if (user) {
    content = <>{JSON.stringify(user)}</>;
  }

  return <Flex flexDir="column">{content}</Flex>;
};

export default Home;
