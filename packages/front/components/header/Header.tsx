import { Flex } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import BrandLogo from '../logo/BrandLogo';
import UserTypeSwitch from '../switch/UserTypeSwitch';
import HeaderButton from './HeaderButton';
import HeaderMenu from './HeaderMenu';

const Header: FC = () => {
  const { user, fetchingUser } = useCurrentUser();
  const { hasScroll } = useLanding();

  return (
    <Flex
      direction="row"
      px={8}
      py={4}
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      zIndex="999"
      width="100%"
      bgColor="neutral.lightGray"
      transition="all ease-in-out 250ms"
      boxShadow={hasScroll ? 'xl' : 'none'}
    >
      <Flex direction="row" alignItems="center">
        <BrandLogo />
        <UserTypeSwitch ml={12} />
      </Flex>
      {!user && !fetchingUser && (
        <Flex direction="row" alignItems="center" justifyContent="center">
          <HeaderMenu />
        </Flex>
      )}
      {!fetchingUser && (
        <Flex direction="row" alignItems="center" justifyContent="end">
          <HeaderButton />
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
