import { Button, ButtonProps, useToast, Text } from '@chakra-ui/react';
import { useLogin } from '@workaurora/front/hooks/useLogin';
import { FC, useCallback, useEffect, useState } from 'react';
import { Chain, useAccount, useNetwork } from 'wagmi';
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
  const { isLoading } = useLogin(signupModalOpen);

  return (
    <ConnectButton>
      <Button variant="primary" size="md" {...props} isLoading={isLoading}>
        {children}
      </Button>
    </ConnectButton>
  );
};

export default LoginButton;
