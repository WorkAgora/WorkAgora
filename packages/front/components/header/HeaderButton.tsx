import { Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import { FC } from 'react';
import LoginButton from '../button/LoginButton';
import NotificationIcon from '../icons/NotificationIcon';
import MessageIcon from '../icons/MessageIcon';
import { shortHash } from '@workagora/utils';

interface HeaderButtonProps {
  onOpen: () => void;
  signupModalOpen: boolean;
}

const HeaderButton: FC<HeaderButtonProps> = ({ onOpen, signupModalOpen }: HeaderButtonProps) => {
  const { user, logout } = useCurrentUser();

  return (
    <Flex>
      {!user && (
        <>
          <LoginButton signupModalOpen={signupModalOpen} mr={8}>
            Login
          </LoginButton>
          <Button variant="primary" size="md" onClick={onOpen}>
            Sign up
          </Button>
        </>
      )}
      {user && (
        <Flex alignItems="center" columnGap={8}>
          <Flex alignItems="center" columnGap={4}>
            <IconButton variant="icon" aria-label="Message Icon" icon={<MessageIcon />} />
            <IconButton variant="icon" aria-label="Message Icon" icon={<NotificationIcon />} />
          </Flex>
          <Text fontFamily="Comfortaa" fontWeight="600" cursor="initial">
            {shortHash(user.wallet, { padLeft: 6, padRight: 4, separator: '...' })}
          </Text>
          <Button variant="outline" size="md" onClick={logout}>
            Disconnect
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default HeaderButton;
