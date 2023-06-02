import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Spinner,
  Text,
  Textarea,
  useDisclosure
} from '@chakra-ui/react';
import { useCurrentCompany, useCurrentUser, useLanding } from '@workagora/front-provider';
import { useGetChatMessages } from '@workagora/front/hooks/useGetChatMessages';
import { useSendMessage } from '@workagora/front/hooks/useSendMessage';
import { ChatInstance, CreateCompany, CreateJob, User, UserTypeEnum } from '@workagora/utils';
import { ChangeEvent, FC, useState, KeyboardEvent, useEffect} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ContractModal from '../../contract/ContractModal';
import FileIcon from '../../icons/FileIcon';
import SendMsgIcon from '../../icons/SendMsgIcon';
import ChatContractProposal from './ChatContractProposal';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';

interface ChatMessagesProps {
  id: string;
  chat: ChatInstance;
  jobRelated?: CreateJob;
}

const ChatMessages: FC<ChatMessagesProps> = ({ id, chat, jobRelated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [curMessage, setCurMessage] = useState<string>();
  const { user } = useCurrentUser();
  const { company } = useCurrentCompany();
  const { type } = useLanding();
  const { sendMessage } = useSendMessage(chat.myWallet, chat.partnerWallet, chat.partnerType);
  const { loading, curMessages, setCurMessages } = useGetChatMessages(chat.PK.replace('INSTANCE#',''));

  const openContractModal = (proposalId: string) => {
    onOpen();
  };

  
  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCurMessage(event.target.value);
  };

  const handleMessageKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && curMessage) {
      event.preventDefault();
      const newMessage = await sendMessage(curMessage);
      setCurMessage('');
      setCurMessages([...curMessages, newMessage]);
    }
  };

  useEffect(() => {console.log(chat)}, [])

  return (
    <>
      <Flex flexDir="column">
        <Flex px={8} py={4}>
          <Flex alignItems="center">
            <Avatar w="64px" h="64px" borderRadius={chat.partnerType === 'User' ? '50%' : '20px'} />
            <Flex flexDir="column" ml={8}>
              <Text fontSize="24px" fontWeight="700" fontFamily="Comfortaa" lineHeight="133%">
                {chat.partnerType === 'User' ? `${chat.partnerUser?.firstname} ${chat.partnerUser?.lastname}` : chat.partnerCompany?.name}
              </Text>
              <Text
                fontSize="16px"
                lineHeight="120%"
                fontFamily="Comfortaa"
                fontWeight="700"
                color="neutral.dsGray"
                textAlign="right"
              >
                {chat.partnerType === 'User' ? chat.partnerUser?.description : chat.partnerCompany?.title}
              </Text>
            </Flex>
          </Flex>
          <Flex ml="auto" alignItems="center">
            <Flex flexDir="column" mr={4}>
              <Text
                fontSize="20px"
                lineHeight="150%"
                fontFamily="Montserrat"
                fontWeight="400"
                color="neutral.black"
                textAlign="right"
              >
                {type === UserTypeEnum.Freelancer ? `${user?.firstname} ${user?.lastname}` : company?.name}
              </Text>
              <Text
                fontSize="16px"
                lineHeight="120%"
                fontFamily="Comfortaa"
                fontWeight="700"
                color="neutral.dsGray"
                textAlign="right"
              >
                {type === UserTypeEnum.Freelancer ? user?.description : company?.title}
              </Text>
            </Flex>
            <Avatar w="64px" h="64px" borderRadius={chat.partnerType === 'User' ? '20px' : '50%'} />
          </Flex>
        </Flex>
        <Divider borderColor="neutral.dsGray" />
        <Flex flexDir="column" maxH="500px" minH="500px">
          <PerfectScrollbar
            options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
            style={{
              width: '100%'
            }}
          >
            {!loading && <Flex flexDir="column" px={4} gap={2} pb={4}>
              {curMessages && curMessages?.map((m, k) => {
               if(m.receiverWallet.toLowerCase() === chat.partnerWallet.toLowerCase()) {
                return <SentMessage 
                      key={k}
                      name={chat.partnerType === 'User' ? company?.name : `${user?.firstname} ${user?.lastname}`}
                      userType={chat.partnerType} 
                      date={new Date(m.createdAt)}
                      message={m.content}
                      />
               } else {
                return <ReceivedMessage 
                        key={k} 
                        name={chat.partnerType === 'User' ? `${chat.partnerUser?.firstname} ${chat.partnerUser?.lastname}` : chat.partnerCompany?.name}
                        userType={chat.partnerType === 'User' ? 'Company' : 'User'}
                        date={new Date(m.createdAt)}
                        message={m.content}
                        />
               }
              })}
            </Flex>}
            {loading &&  <Flex
                flexDir="column"
                justifyContent="center"
                alignItems="center"
                my={16}
              >
                <Spinner color="brand.primary" size="xl" mx="auto" />
                <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
                  Loading Messages
                </Box>
              </Flex>}
          </PerfectScrollbar>
        </Flex>
        <Flex bgColor="neutral.lightGray" px={4} py={6} alignItems="center">
          <Textarea
            placeholder="Type your message"
            color="neutral.black"
            _placeholder={{ color: 'neutral.dsDarkGray' }}
            maxH="40px"
            minH="40px"
            resize="none"
            value={curMessage}
            onChange={handleMessageChange}
            onKeyDown={handleMessageKeyDown}
          />
          <Flex
            alignItems="center"
            ml={4}
            cursor="pointer"
            color="neutral.dsGray"
            transition="all ease-in-out 250ms"
            _hover={{ color: 'neutral.dsDarkGray' }}
            onClick={() => {
              if (curMessage) {
                sendMessage(curMessage);
                setCurMessage(undefined);
              }
            }}
          >
            <Box mr={2}>
              <SendMsgIcon />
            </Box>
            <Text fontSize="18px" fontWeight="600" lineHeight="180%" fontFamily="Comfortaa">
              Send
            </Text>
          </Flex>
        </Flex>
        <Box ml="auto" mt={2}>
          <Button variant="outline" leftIcon={<FileIcon />}>
            Create new contract
          </Button>
        </Box>
      </Flex>
      <ContractModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ChatMessages;
