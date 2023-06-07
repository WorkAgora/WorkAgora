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
import { updateRelatedJob } from '@workagora/front/services/chat';
import { useRouter } from 'next/router';
import { useResponsive } from '@workagora/front/hooks/useResponsive';

interface ChatMessagesProps {
  id: string;
  chat: ChatInstance;
  isNewChat: boolean;
  onNewChatMessage?: () => void;
}

const ChatMessages: FC<ChatMessagesProps> = ({ id, chat, isNewChat = false, onNewChatMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [curMessage, setCurMessage] = useState<string>();
  const { user } = useCurrentUser();
  const { company } = useCurrentCompany();
  const { type } = useLanding();
  const { sendMessage } = useSendMessage();
  const { loading, curMessages, setCurMessages } = useGetChatMessages(chat?.PK?.replace('INSTANCE#',''));
  const [ contractIsForm, setContractIsForm] = useState(false);
  const { query } = useRouter();
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCurMessage(event.target.value);
  };

  const handleMessageKeyDown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && curMessage) {
      event.preventDefault();
      await messageSendHandler();
    }
  };

  const messageSendHandler = async () => {
    if (curMessage && user) {
      if (chat.partnerUser?.wallet) {
      const newMessage = await sendMessage(curMessage, user?.wallet, chat.partnerUser?.wallet, chat.user1Type);
      setCurMessage('');
      setCurMessages([...curMessages, newMessage]);
        if (isNewChat) {
          onNewChatMessage()
        }
      } else if (chat.partnerCompany?.companyWallet) {
        const newMessage = await sendMessage(curMessage, user?.wallet, chat.partnerCompany?.companyWallet, chat.user1Type);
        setCurMessage('');
        setCurMessages([...curMessages, newMessage]);
        if (isNewChat) {
          onNewChatMessage()
        }
      }
    }
  };

  useEffect(() => {
    if (!chat.jobRelated && chat.PK != '' && query.job) {
      updateRelatedJob({instanceId: chat.PK, jobRelated: query.job as string});
    } 
  }, [chat, query.job])

  const getUserName = (me: boolean) => {
    if (!me) {
      if (chat.user1 === user?.wallet.toLowerCase()) {
        if (chat.user1Type === 'User') {
          return {name: chat.partnerCompany?.name, type: 'Company', title: chat.partnerCompany?.title}
        } else {
          return {name: `${chat.partnerUser?.firstname} ${chat.partnerUser?.lastname}`, type: 'User', title: chat.partnerUser?.description}
        }
      }
      if (chat.user2 === user?.wallet.toLowerCase()) {
        if (chat.user1Type === 'User') {
          return {name: `${chat.partnerUser?.firstname} ${chat.partnerUser?.lastname}` , type: 'User', title: chat.partnerUser?.description}
        } else {
          return {name: chat.partnerCompany?.name , type: 'Company', title: chat.partnerCompany?.title}
        }
      }
    } else {
      if (chat.user1 === user?.wallet.toLowerCase()) {
        if (chat.user1Type === 'User') {
          return {name: `${user.firstname} ${user.lastname}`, type: 'User', title: user.description}
        } else {
          return {name: company?.name, type: 'Company', title: company?.title}
        }
      }
      if (chat.user2 === user?.wallet.toLowerCase()) {
        if (chat.user1Type === 'User') {
          return {name: company?.name, type: 'Company', title: company?.title}
        } else {
          return {name: `${user.firstname} ${user.lastname}`, type: 'User', title: user.description}
        }
      }
    }
  }

  return (
    <>
      <Flex flexDir="column" w={{base: "100%", lg: "initial"}}>
        <Flex px={{base: 2, lg: 8}} py={4}  w={{base: "100%", lg: "initial"}}>
          <Flex alignItems="center"  w={{base: "100%", lg: "initial"}}  px={{base: 2, lg: 0}}>
            <Avatar w={{base: "32px", lg: "64px"}} h={{base: "32px", lg: "64px"}} borderRadius={{base: getUserName(false).type === 'Company' ? '10px' : '50%',lg: getUserName(false).type === 'Company' ? '20px' : '50%' }} />
            <Flex flexDir="column" ml={{base: 2, lg: 4}}>
              <Text fontSize={{base: "16px", lg: "20px"}} fontWeight="700" fontFamily="Comfortaa" lineHeight="133%">
                {getUserName(false)?.name}
              </Text>
              <Text
                fontSize={{base: "14px", lg: "16px"}} 
                lineHeight="120%"
                fontFamily="Comfortaa"
                fontWeight="700"
                color="neutral.dsGray"
                textAlign="right"
              >
                {getUserName(false)?.title}
              </Text>
            </Flex>
          </Flex>
          <Flex ml="auto" alignItems="center">
            <Flex flexDir="column" mr={{base: 2, lg: 4}}>
              <Text
                fontSize={{base: "16px", lg: "20px"}} 
                lineHeight="150%"
                fontFamily="Montserrat"
                fontWeight="400"
                color="neutral.black"
                textAlign="right"
              >
                {getUserName(true)?.name}
              </Text>
              <Text
                fontSize={{base: "14px", lg: "16px"}} 
                lineHeight="120%"
                fontFamily="Comfortaa"
                fontWeight="700"
                color="neutral.dsGray"
                textAlign="right"
              >
                {getUserName(true)?.title}
              </Text>
            </Flex>
            <Avatar w={{base: "32px", lg: "64px"}} h={{base: "32px", lg: "64px"}} borderRadius={{base: getUserName(true)?.type === 'User' ? '50%' : '10px', lg: getUserName(true)?.type === 'User' ? '50%' : '20px' }} />
          </Flex>
        </Flex>
        <Divider borderColor="neutral.dsGray" />
        <Flex flexDir="column" maxH={{base: "45vh", '2xl': "52.5vh"}} minH={{base: "45vh", '2xl': "52.5vh"}}>
          <PerfectScrollbar
            options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
            style={{
              width: '100%'
            }}
          >
            {!loading && <Flex flexDir="column" px={4} gap={2} pb={4}>
              {curMessages && curMessages?.map((m, k) => {
               if(m.receiverWallet.toLowerCase() !== user?.wallet.toLowerCase()) {
                return <SentMessage 
                      key={k}
                      name={getUserName(true)?.name}
                      userType={getUserName(true)?.type} 
                      date={new Date(m.createdAt)}
                      message={m.content}
                      />
               } else {
                return <ReceivedMessage 
                        key={k} 
                        name={getUserName(false)?.name}
                        userType={getUserName(false)?.type}
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
        <Flex bgColor="neutral.lightGray" px={{base: 2, lg: 4}} py={{base: 2, lg: 6}} alignItems="center">
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
                messageSendHandler();
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
        {getUserName(true)?.type === 'Company' && <Box ml="auto" mt={2} mb={{base: 2, lg: 0}} mr={{base: 4, lg: 0}}>
           <Button variant="outline" leftIcon={<FileIcon />} onClick={() => {
            setContractIsForm(true);
            onOpen();
           }}>
            Create new contract
          </Button>
        </Box>}
      </Flex>
      <ContractModal isOpen={isOpen} onClose={onClose} sender={company} receiver={chat.partnerUser} isForm={contractIsForm} relatedJob={chat.jobRelated}/>
    </>
  );
};

export default ChatMessages;
