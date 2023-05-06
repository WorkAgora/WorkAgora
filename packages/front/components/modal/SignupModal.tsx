import {
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

const SignupModal: FC = () => {
  const { disconnect } = useDisconnect();
  const { signupModalOpen, setSignupModalOpen } = useLanding();

  const close = () => {
    disconnect();
    setTimeout(() => {
      setSignupModalOpen(false);
    }, 200);
  };

  return (
    <Modal isOpen={signupModalOpen} onClose={close} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign up</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
    </Modal>
  );
};

export default SignupModal;
