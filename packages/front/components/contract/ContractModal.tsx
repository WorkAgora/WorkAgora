import {
  Drawer,
  Box,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Avatar,
  Text,
  DrawerOverlay
} from '@chakra-ui/react';
import { useCurrentCompany, useCurrentUser } from '@workagora/front-provider';
import { CreateCompany, User } from '@workagora/utils';
import { FC } from 'react';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContractModal: FC<ContractModalProps> = ({ isOpen, onClose }) => {
  const userType: 'User' | 'Company' = 'Company';
  const { user } = useCurrentUser();
  const { company } = useCurrentCompany();

  const receiver: User | CreateCompany | null = company;
  const sender = user;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
      <DrawerOverlay>
        <DrawerContent p={8}>
          <Flex alignItems="center" mb={4}>
            <Avatar w="64px" h="64px" borderRadius={userType === 'Company' ? '20px' : '50%'} />
            <Flex flexDir="column" ml={8}>
              <Text fontSize="24px" fontWeight="700" fontFamily="Comfortaa" lineHeight="133%">
                {userType === 'User'
                  ? `${(receiver as User)?.firstname} ${(receiver as User)?.lastname}`
                  : (receiver as CreateCompany)?.name}
              </Text>
              <Text
                fontSize="16px"
                lineHeight="120%"
                fontFamily="Comfortaa"
                fontWeight="700"
                color="neutral.dsGray"
                textAlign="right"
              >
                {userType === 'User'
                  ? (receiver as User)?.description
                  : (receiver as CreateCompany)?.title}
              </Text>
            </Flex>
            <DrawerCloseButton top="2rem" />
          </Flex>
          <Flex
            flexDir="column"
            borderRadius="16px"
            border="1px solid"
            borderColor="brand.primary"
            p={6}
          ></Flex>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default ContractModal;
