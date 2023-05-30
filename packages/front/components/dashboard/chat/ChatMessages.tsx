import { Avatar, Box, Divider, Flex, Input, Text } from '@chakra-ui/react';
import { CreateCompany, CreateJob, User } from '@workagora/utils';
import { FC } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SendMsgIcon from '../../icons/SendMsgIcon';

interface ChatMessagesProps {
  id: string;
  receiver: User | CreateCompany;
  userType: 'User' | 'Company';
  sender: User | CreateCompany;
  jobRelated?: CreateJob;
}

const ChatMessages: FC<ChatMessagesProps> = ({ id, receiver, userType, sender, jobRelated }) => {
  return (
    <Flex flexDir="column">
      <Flex px={8} py={4}>
        <Flex>
          <Avatar w="64px" h="64px" borderRadius={userType === 'Company' ? '20px' : '50%'} />
          <Flex flexDir="column" ml={8}>
            <Text fontSize="24px" fontWeight="700" fontFamily="Comfortaa" lineHeight="133%">
              {userType === 'User'
                ? `${(receiver as User)?.firstname} ${(receiver as User)?.lastname}`
                : (receiver as CreateCompany)?.name}
            </Text>
          </Flex>
        </Flex>
        <Flex ml="auto">
          <Flex flexDir="column" mr={4}>
            <Text
              fontSize="20px"
              lineHeight="150%"
              fontFamily="Montserrat"
              fontWeight="400"
              color="neutral.black"
              textAlign="right"
            >
              {userType === 'User'
                ? (sender as CreateCompany)?.name
                : `${(sender as User)?.firstname} ${(sender as User)?.lastname}`}
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
                ? (sender as CreateCompany)?.title
                : (sender as User)?.description}
            </Text>
          </Flex>
          <Avatar w="64px" h="64px" borderRadius={userType === 'Company' ? '50%' : '20px'} />
        </Flex>
      </Flex>
      <Divider borderColor="neutral.dsGray" />
      <Flex flexDir="column" maxH="500px" minH="500px">
        <PerfectScrollbar
          options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
          style={{
            width: '100%'
          }}
        ></PerfectScrollbar>
      </Flex>
      <Flex bgColor="neutral.lightGray" px={4} py={6} alignItems="center">
        <Input
          placeholder="Type your message"
          color="neutral.black"
          _placeholder={{ color: 'neutral.dsDarkGray' }}
        />
        <Flex
          alignItems="center"
          ml={4}
          cursor="pointer"
          color="neutral.dsGray"
          transition="all ease-in-out 250ms"
          _hover={{ color: 'neutral.dsDarkGray' }}
        >
          <Box mr={2}>
            <SendMsgIcon />
          </Box>
          <Text fontSize="18px" fontWeight="600" lineHeight="180%" fontFamily="Comfortaa">
            Send
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatMessages;
