import { Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import Product from '../components/landing/product/Product';
import Technology from '../components/landing/technology/Technology';
import Community from '../components/landing/community/Community';
import Contact from '../components/landing/contact/Contact';
import Footer from '../components/landing/footer/Footer';
import { useRouter } from 'next/router';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Home: NextPage = () => {
  const { user } = useCurrentUser();
  const { push, pathname } = useRouter();
  const { handleScroll } = useLanding();

  if (user && !pathname.includes('dashboard')) {
    push('/dashboard');
  }

  return (
    <PerfectScrollbar
      options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
      onScrollY={handleScroll}
    >
      <Flex flexDir="column">
        <Product />
        <Technology />
        <Community />
        <Contact />
        <Footer />
      </Flex>
    </PerfectScrollbar>
  );
};

export default Home;
