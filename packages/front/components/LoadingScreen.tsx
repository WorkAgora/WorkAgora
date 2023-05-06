import { Flex, Spinner } from '@chakra-ui/react';
import { FC } from 'react';

interface LoadingScreenProps {
  isFetching: boolean;
}

const LoadingScreen: FC<LoadingScreenProps> = ({ isFetching }: LoadingScreenProps) => {
  return (
    <Flex
      w="100vw"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      visibility={isFetching ? 'visible' : 'hidden'}
      opacity={isFetching ? 1 : 0}
      bgColor="neutral.lightGray"
      position="absolute"
      zIndex="9999"
      transition="all ease-in-out 200ms"
    >
      <Spinner size="xl" color="brand.primary" mt={8} />
    </Flex>
  );
};

export default LoadingScreen;
