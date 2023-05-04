import { Box, BoxProps } from '@chakra-ui/react';
import { ConnectButton as RainbowButton } from '@rainbow-me/rainbowkit';
import { FC, ReactNode } from 'react';

interface ConnectButtonProps extends BoxProps {
  children: ReactNode;
}

const ConnectButton: FC<ConnectButtonProps> = ({ children, ...props }) => {
  return (
    <RainbowButton.Custom>
      {({ openConnectModal }) => {
        return (
          <Box
            gap={12}
            display="flex"
            justifyContent="center"
            {...props}
            onClick={() => {
              openConnectModal();
            }}
          >
            {children}
          </Box>
        );
      }}
    </RainbowButton.Custom>
  );
};

export default ConnectButton;
