import { Button, ButtonProps } from '@chakra-ui/react';
import { useLogin } from '@workaurora/front/hooks/useLogin';
import { FC } from 'react';
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
      <Button variant="link" size="md" {...props} isLoading={isLoading}>
        {children}
      </Button>
    </ConnectButton>
  );
};

export default LoginButton;
