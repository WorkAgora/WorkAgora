import {
  Button,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react';
import { checkKycStatus, getKycSession } from '../../services/kyc';
import { FC, useCallback, useEffect, useState } from 'react';
import Synaps from '@synaps-io/react-verify';

const KycButton: FC = () => {
  const [kycSession, setKycSession] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleKycAction = async () => {
    if (!kycSession) {
      const res = await getKycSession();
      if (res.sessionId) {
        setKycSession(res.sessionId);
      }
    }
    if (kycSession) {
      setOpenModal(true);
    }
  };

  const getHasKyc = useCallback(async () => {
    const res = await checkKycStatus();
    if (res.sessionId) {
      setKycSession(res.sessionId);
    }
  }, []);

  useEffect(() => {
    getHasKyc();
  }, [getHasKyc]);

  return (
    <>
      <Flex flexDir="column">
        <Box>
          <Button variant="primary" onClick={handleKycAction}>
            {kycSession ? 'End KYC' : 'Start KYC'}
          </Button>
        </Box>
      </Flex>
      <Modal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>KYC</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Synaps
              sessionId={kycSession}
              service={'individual'}
              lang={'en'}
              onReady={() => console.log('component ready')}
              onFinish={() => console.log('user finish process')}
              color={{
                primary: '212b39',
                secondary: 'ffffff'
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default KycButton;
