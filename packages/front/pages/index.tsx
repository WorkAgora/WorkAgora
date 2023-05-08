import { Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useCurrentUser } from '@workagora/front-provider';
import Product from '../components/landing/product/Product';
import Technology from '../components/landing/technology/Technology';
import Community from '../components/landing/community/Community';
import Contact from '../components/landing/contact/Contact';
import Footer from '../components/landing/footer/Footer';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { user } = useCurrentUser();
  const { push } = useRouter();

  if (user) {
    push('/dashboard');
  }

  return (
    <Flex flexDir="column">
      <Product />
      <Technology />
      <Community />
      <Contact />
      <Footer />
    </Flex>
  );
};

export default Home;
