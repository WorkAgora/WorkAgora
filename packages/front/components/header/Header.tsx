import { Flex } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import BrandLogo from '../logo/BrandLogo';
import UserTypeSwitch from '../switch/UserTypeSwitch';
import HeaderButton from './HeaderButton';
import HeaderMenu from './HeaderMenu';

const Header: FC = () => {
  const { signupModalOpen, setSignupModalOpen, setType } = useLanding();
  const { user } = useCurrentUser();

  return (
    <Flex direction="row" px={8} py={4} h="80px" alignItems="center" justifyContent="space-between">
      <Flex direction="row" alignItems="center">
        <BrandLogo />
        <UserTypeSwitch userType="Freelance" ml={12} onTypeChange={setType} />
      </Flex>
      {!user && (
        <Flex direction="row" alignItems="center" justifyContent="center">
          <HeaderMenu />
        </Flex>
      )}
      <Flex direction="row" alignItems="center" justifyContent="end">
        <HeaderButton onOpen={() => setSignupModalOpen(true)} signupModalOpen={signupModalOpen} />
      </Flex>
    </Flex>
  );
};

export default Header;
