import { FC } from 'react';
import { Box, Flex, Button, Spacer, Image, useDisclosure, Text } from '@chakra-ui/react';
import FullScreenModal from '../modal/SignupModal';
import SignupForm from '../form/SignupForm';
import LoginButton from '../button/LoginButton';
import { useAccount, useDisconnect } from 'wagmi';
import { useCurrentUser } from '@workaurora/front/hooks/useCurrentUser';
import { shortHash } from '@workaurora/utils';

const HeaderMenu: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { user, logout } = useCurrentUser();
  return (
    <>
      <Box width="100%" height="60px">
        <Flex align="center" height="100%" px={{ base: 4, md: 8 }}>
          <Box>
            {/* Replace the 'src' with your logo's URL */}
            <Image src="/logo.png" alt="Logo" height="40px" />
          </Box>
          <Spacer />
          {!user && (
            <>
              <LoginButton signupModalOpen={isOpen} mr={4}>
                Login
              </LoginButton>
              <Button
                variant="link"
                color="green.300"
                _hover={{ color: 'green.200', textDecoration: 'underline' }}
                size="md"
                onClick={onOpen}
              >
                Sign Up
              </Button>
            </>
          )}
          {user && (
            <>
              <Text mr={4}>Connected with {shortHash(user.wallet)}</Text>
              <Button variant="primary" onClick={logout}>
                Disconnect
              </Button>
            </>
          )}
        </Flex>
      </Box>
      <FullScreenModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          if (isConnected && address) {
            disconnect();
          }
        }}
      >
        <SignupForm onSubmitSuccess={onClose} />
      </FullScreenModal>
    </>
  );
};

export default HeaderMenu;
