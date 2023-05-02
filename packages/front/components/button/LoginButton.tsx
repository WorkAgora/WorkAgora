import { Button, ButtonProps } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useConnect } from '../../hooks/useConnect';
import ConnectButton from './ConnectButton';

interface LoginButtonProps extends ButtonProps {
  signupModalOpen: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({
  children,
  signupModalOpen,
  ...props
}: LoginButtonProps) => {
  const { signIn } = useConnect();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!signupModalOpen) {
      if (isConnected && address && chain) {
        signIn({ address, chain });
      }
    }
  }, [address, chain, isConnected, signIn, signupModalOpen]);

  return (
    <ConnectButton>
      <Button variant="primary" size="md" {...props}>
        {children}
      </Button>
    </ConnectButton>
  );
};

export default LoginButton;
