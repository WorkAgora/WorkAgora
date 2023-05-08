import { Box, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useCurrentUser } from '@workagora/front-provider';
import Product from '../components/landing/product/Product';
import KycButton from '../components/button/KycButton';

const Dashboard: NextPage = () => {
  const { user } = useCurrentUser();

  let content = (
    <>
      <Product />
    </>
  );

  if (user) {
    content = <>{JSON.stringify(user)}</>;
  }

  return (
    <Flex flexDir="column" w="100%" mt="80px">
      {content}
      <Box>
        <KycButton />
      </Box>
    </Flex>
  );
};

export default Dashboard;
