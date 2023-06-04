import {
  Drawer,
  Box,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Avatar,
  Text,
  DrawerOverlay,
  Divider
} from '@chakra-ui/react';
import { CreateCompany, CreateJob, User } from '@workagora/utils';
import { FC } from 'react';
import ContractTop from './ContratTop';
import ContractForm from './ContractForm';

interface ContractModalProps {
  isOpen: boolean;
  sender?: CreateCompany;
  receiver?: User;
  relatedJob?: string;
  isForm: boolean;
  onClose: () => void;
}

const ContractModal: FC<ContractModalProps> = ({ isOpen, onClose, sender, receiver, isForm, relatedJob }) => {

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
      <DrawerOverlay>
        <DrawerContent p={8}>
          <Flex alignItems="center" mb={4}>
              <Text
                fontSize="16px"
                lineHeight="120%"
                fontFamily="Comfortaa"
                fontWeight="700"
                color="neutral.dsGray"
                textAlign="right"
              >
                New contract proposal
              </Text>
            <DrawerCloseButton top="1.75rem" />
          </Flex>
          <ContractTop sender={sender} receiver={receiver} />
          <Divider borderColor="neutral.black" my={4}/>
          {isForm && <ContractForm relatedJob={relatedJob}/>}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default ContractModal;
