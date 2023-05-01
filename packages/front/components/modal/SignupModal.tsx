import { Box, IconButton, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { CloseIcon } from '@chakra-ui/icons';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const FullScreenModal: FC<FullScreenModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={{ base: 'full', md: '2xl' }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <Box position="absolute" top={2} right={2}>
          <IconButton
            aria-label="Close modal"
            bg="none"
            icon={<CloseIcon />}
            size="sm"
            onClick={onClose}
            borderRadius="full"
          />
        </Box>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullScreenModal;
