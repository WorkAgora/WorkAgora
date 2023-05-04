import { Flex, useDisclosure } from '@chakra-ui/react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { FC } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import SignupForm from '../form/SignupForm';
import BrandLogo from '../icons/BrandLogo';
import SignupModal from '../modal/SignupModal';
import UserTypeSwitch from '../switch/UserTypeSwitch';
import HeaderButton from './HeaderButton';
import HeaderMenu from './HeaderMenu';

const Header: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { disconnect } = useDisconnect();
  const { user } = useCurrentUser();

  return (
    <>
      <Flex
        direction="row"
        px={8}
        py={4}
        h="80px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex direction="row" alignItems="center">
          <BrandLogo />
          <UserTypeSwitch userType="Freelance" ml={12} />
        </Flex>
        {!user && (
          <Flex direction="row" alignItems="center" justifyContent="center">
            <HeaderMenu />
          </Flex>
        )}
        <Flex direction="row" alignItems="center" justifyContent="end">
          <HeaderButton onOpen={onOpen} signupModalOpen={isOpen} />
        </Flex>
      </Flex>
      <SignupModal
        isOpen={isOpen}
        onClose={() => {
          disconnect();
          setTimeout(() => {
            onClose();
          }, 200);
        }}
        title="Sign up"
      >
        <SignupForm
          onSubmitSuccess={() => {
            disconnect();
            setTimeout(() => {
              onClose();
            }, 200);
          }}
        />
      </SignupModal>
    </>
  );
};

export default Header;
