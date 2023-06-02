import { Avatar, Flex, Text } from '@chakra-ui/react';
import { CreateCompany, User } from '@workagora/utils';
import { FC } from 'react';

interface ChatPreviewProps {
  id: string;
  receiver?: User | CreateCompany;
  userType: 'User' | 'Company';
  lastMessage?: string;
  lastMessageDate?: Date;
  isActive: boolean;
  onClick: (id: string) => void;
}

const ChatPreview: FC<ChatPreviewProps> = ({
  id,
  receiver,
  userType,
  lastMessage,
  lastMessageDate,
  isActive,
  onClick
}) => {
  return (
    <Flex
      bgColor={!isActive ? '' : 'neutral.lightGray'}
      cursor="pointer"
      transition="all ease-in-out 250ms"
      _hover={{ bgColor: 'neutral.lightGray' }}
      borderRadius="8px 0px 0px 8px"
      p={2}
      columnGap={2}
      onClick={() => onClick(id)}
    >
      <Avatar
        w="32px"
        h="32px"
        borderRadius={userType === 'User' ? '50%' : '12px'}
        my="auto"
        iconLabel=""
      />
      <Flex flexDir="column">
        <Text
          fontSize="14px"
          lineHeight="150%"
          fontFamily="Montserrat"
          fontWeight="700"
          color="neutral.black"
        >
          {receiver && <>
            {userType === 'User'
              ? `${(receiver as User)?.firstname} ${(receiver as User)?.lastname}`
              : (receiver as CreateCompany)?.name}
            </>}
        </Text>
        <Text
          fontSize="14px"
          lineHeight="150%"
          fontFamily="Montserrat"
          fontWeight="400"
          color="neutral.black"
        >
          {lastMessage && lastMessage !== '' ? lastMessage : 'New discussion'}
        </Text>
      </Flex>
      {lastMessageDate && <Text
        ml="auto"
        mt={0.1}
        mr={1}
        fontSize="12px"
        lineHeight="150%"
        fontFamily="Montserrat"
        fontWeight="400"
        color="neutral.dsGray"
      >
        {lastMessageDate.getHours()}:{lastMessageDate.getMinutes()}
      </Text>}
    </Flex>
  );
};

export default ChatPreview;
