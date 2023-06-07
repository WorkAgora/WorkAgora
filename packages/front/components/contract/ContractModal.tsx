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
import { useResponsive } from '@workagora/front/hooks/useResponsive';
import PerfectScrollbar from 'react-perfect-scrollbar';

interface ContractModalProps {
  isOpen: boolean;
  sender?: CreateCompany;
  receiver?: User;
  relatedJob?: string;
  isForm: boolean;
  onClose: () => void;
}

const ContractModal: FC<ContractModalProps> = ({ isOpen, onClose, sender, receiver, isForm, relatedJob }) => {
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();


  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl" blockScrollOnMount={false}>
      <DrawerOverlay>
        <DrawerContent px={{base:0, lg: 8}} py={{base: 4, lg: 8}}>
          <Flex alignItems="center" mb={4} ml={{base: 4, lg: 0}}>
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
            <DrawerCloseButton top={{base: '.5rem', lg: "1.75rem"}} />
          </Flex>
          {desktopDisplay && <>
            <ContractTop sender={sender} receiver={receiver} />
            <Divider borderColor="neutral.black" my={4}/>
            {isForm && <ContractForm relatedJob={relatedJob}/>}
          </>}
          {!desktopDisplay && <Flex maxH="95vh" position="relative" pb={6}>
          <PerfectScrollbar
          options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
          style={{
            width: '100%'
          }}
        >
            <Flex flexDir="column" px={2}>
            <ContractTop sender={sender} receiver={receiver} />
              <Divider borderColor="neutral.black" my={4}/>
              {isForm && <ContractForm relatedJob={relatedJob}/>}
            </Flex>
          </PerfectScrollbar>
            </Flex>}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default ContractModal;
