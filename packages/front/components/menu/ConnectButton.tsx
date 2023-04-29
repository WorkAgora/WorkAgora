import { Box } from '@chakra-ui/react';
import { ConnectButton as RainbowButton } from '@rainbow-me/rainbowkit';
import { FC, ReactNode } from 'react';

const ConnectButton: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RainbowButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <Box gap={12} display="flex" justifyContent="center">
            <Box
              onClick={() => {
                openConnectModal();
              }}
            >
              {children}
            </Box>
          </Box>
        );
      }}
    </RainbowButton.Custom>
  );
};

export default ConnectButton;
