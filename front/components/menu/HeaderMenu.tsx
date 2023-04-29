import { FC } from 'react';
import { Box, Flex, Button, Spacer, Image } from '@chakra-ui/react';
import ConnectButton from './ConnectButton';
import { useAccount } from 'wagmi';
import { shortHash } from '@/utils';

const HeaderMenu: FC = () => {
  const { isConnected, address } = useAccount();

  return (
    <Box width="100%" height="60px">
      <Flex align="center" height="100%" px={{ base: 4, md: 8 }}>
        <Box>
          {/* Replace the 'src' with your logo's URL */}
          <Image src="/logo.png" alt="Logo" height="40px" />
        </Box>
        <Spacer />
        {!isConnected && (
          <>
            <ConnectButton>
              <Button variant="primary" size="md" mr={4}>
                Login
              </Button>
            </ConnectButton>
            <Button
              variant="link"
              color="green.300"
              _hover={{ color: 'green.200', textDecoration: 'underline' }}
              size="md"
            >
              Sign Up
            </Button>
          </>
        )}
        {isConnected && (
          <Button variant="primary" size="md" mr={4}>
            {shortHash(address)}
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default HeaderMenu;
