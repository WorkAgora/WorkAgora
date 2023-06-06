import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { useDisconnect } from 'wagmi';
import SignupForm from '../form/SignupForm';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

const SignupModal: FC = () => {
  const { disconnect } = useDisconnect();
  const { signupModalOpen, setSignupModalOpen } = useLanding();
  const {mobileDisplay , tabletDisplay, desktopDisplay} = useResponsive();

  const close = () => {
    disconnect();
    setTimeout(() => {
      setSignupModalOpen(false);
    }, 200);
  };

  return (
    <>
      {(desktopDisplay || tabletDisplay) && <Modal isOpen={signupModalOpen} onClose={close} isCentered={mobileDisplay ? false : true} size={{base: 'full', md: "xl"}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <SignupForm
              onSubmitSuccess={() => {
                disconnect();
                setTimeout(() => {
                  setSignupModalOpen(false);
                }, 200);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>}
      {mobileDisplay && <Drawer placement="left" onClose={close} isOpen={signupModalOpen}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerHeader>Sign up</DrawerHeader>
              <DrawerCloseButton top=".75rem"/>
              <DrawerBody mt={".5rem"} height="100%" display="flex" flexDir="column">
                  <SignupForm
                  onSubmitSuccess={() => {
                    disconnect();
                    setTimeout(() => {
                      setSignupModalOpen(false);
                    }, 200);
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>}
    </>
  );
};

export default SignupModal;
