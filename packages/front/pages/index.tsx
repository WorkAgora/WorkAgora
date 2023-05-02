import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useCurrentUser } from '../hooks/useCurrentUser';

const Home: NextPage = () => {
  const { user } = useCurrentUser();
  return <Box>{user ? 'logged' : 'not logged'}</Box>;
};

export default Home;
