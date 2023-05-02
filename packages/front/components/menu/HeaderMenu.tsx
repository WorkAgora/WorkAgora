import { FC } from 'react';
import { Box, Flex, Button, Spacer, Image, useDisclosure } from '@chakra-ui/react';
import FullScreenModal from '../modal/SignupModal';
import SignupForm from '../form/SignupForm';
import LoginButton from '../button/LoginButton';
import { useAccount, useDisconnect } from 'wagmi';

const HeaderMenu: FC = () => {
  const authenticated = false;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <>
      <Box width="100%" height="60px">
        <Flex align="center" height="100%" px={{ base: 4, md: 8 }}>
          <Box>
            {/* Replace the 'src' with your logo's URL */}
            <Image src="/logo.png" alt="Logo" height="40px" />
          </Box>
          <Spacer />
          {!authenticated && (
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
