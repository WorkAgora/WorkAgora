import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { useChatInstance, useCurrentCompany, useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChatPreview from './ChatPreview';
import ChatMessages from './ChatMessages';
import { useRouter } from 'next/router';
import { useGetJobById } from '@workagora/front/hooks/useGetJobById';
import { ChatAuthorType, ChatInstance, UserTypeEnum } from '@workagora/utils';
import { useGetMyChats } from '@workagora/front/hooks/useGetMyChats';
import { useGetUserProfile } from '@workagora/front/hooks/useGetUserProfile';
import { useResponsive } from '@workagora/front/hooks/useResponsive';
import { updateRelatedJob } from '@workagora/front/services/chat';
import { ArrowLeftIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);

const DashboardChat: FC = () => {
  const { type } = useLanding();
  const { user } = useCurrentUser();
  const { company } = useCurrentCompany();
  const [activeChat, setActiveChat] = useState('');
  const {curJob, getJobById, loading} = useGetJobById();
  const { curUser, getProfile } = useGetUserProfile();
  const {fetching, chats } = useChatInstance();
  const [newChat, setNewChat] = useState<ChatInstance>();
  const { query } = useRouter();
  useGetMyChats();
  const {mobileDisplay, tabletDisplay, desktopDisplay} = useResponsive();
  const [chatOpen, setChatOpen] = useState(false);


  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  useEffect(() => {
    if (query && query.job && type === UserTypeEnum.Freelancer) {
      getJobById(query.job as string)
    }
    if (query && query.freelance && type === UserTypeEnum.Company) {
      getProfile(query.freelance as string);
    }
  },[getJobById, getProfile, query, type])
  

  useEffect(() => {
    if (query && query.job && type === UserTypeEnum.Freelancer && curJob && user && curJob.company?.companyWallet) {
      if (!chats || (chats && !chats.find((v) => v.user2 === curJob.company?.companyWallet || v.user1 === curJob.company?.companyWallet))) {
        setNewChat({
          PK: '',
          SK: '',
          user1: user?.wallet,
          user2: curJob.company?.companyWallet,
          jobRelated: curJob.uuid,
          user1Type: ChatAuthorType.User,
          partnerCompany: curJob.company,
          visible: true
        });
        setActiveChat('newChat');
      } else {
        const index = chats.findIndex((v) => v.user2 === curJob.company?.companyWallet || v.user1 === curJob.company?.companyWallet);
        if (index !== -1) {
          setActiveChat(index.toString());
          if (!chats[index].jobRelated) {
            updateRelatedJob({instanceId: chats[index].PK, jobRelated: query.job as string});
          }
        }
      }
    }
    if (query && query.freelance && type === UserTypeEnum.Company && curUser && company && curUser.wallet && user) {
      if (!chats || (chats && !chats.find((v) => v.user2 === curUser.wallet || v.user1 === curUser.wallet))) {
        setNewChat({
          PK: '',
          SK: '',
          user1: user?.wallet,
          user2: curUser.wallet,
          user1Type: ChatAuthorType.Company,
          partnerUser: curUser,
          visible: true,
        })
        setActiveChat('newChat');
      }
    }
  }, [curJob, curUser, query, type, user, company])

  const getChatReceiver = (v: ChatInstance) => {
    if (v.user1 === user?.wallet.toLowerCase()) {
      if (v.user1Type === 'User') {
        return v.partnerCompany
      } else {
        return v.partnerUser
      }
    }
    if (v.user2 === user?.wallet.toLowerCase()) {
      if (v.user1Type === 'User') {
        return v.partnerUser
      } else {
        return v.partnerCompany
      }
    }
    return v.partnerUser
  };

  const getChatReceiverUserType = (v: ChatInstance) => {
    if (v.user1 === user?.wallet.toLowerCase()) {
      if (v.user1Type === 'User') {
        return 'Company';
      } else {
        return 'User';
      }
    }
    if (v.user2 === user?.wallet.toLowerCase()) {
      if (v.user1Type === 'User') {
        return 'User';
      } else {
        return 'Company';
      }
    }
    return 'User';
  }

  return (
    <Flex px={{base: 0, lg: 6}} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        maxHeight="calc(100vh - 100px)"
        bgColor="neutral.white"
        px={{base: 0, lg: 8}}
        py={{base: 2, lg: 6}}
        gap={{base: 4, lg: 8}}
        borderRadius={{base: '32px', lg: "64px"}}
        mb={6}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            display="flex"
            flexDir="column"
            flexGrow="1"
            maxHeight={{base: "calc(100vh -20px)", lg: "calc(100vh - 100px)"}}
          >
            <Flex flexDir="column" gap={4} flexGrow="1" maxHeight={{base: "calc(100vh -20px)", lg: "calc(100vh - 100px)"}}>
              <Flex>
                <Box textStyle="h2" as="h1" w="100%" textAlign="left" ml={{base: 4, lg: 0}}>
                  Messages
                </Box>
                {!desktopDisplay && chatOpen && <Box><Button variant="icon" onClick={() => setChatOpen(false)}><ArrowLeftIcon/></Button></Box>}
              </Flex>
              {!fetching && desktopDisplay && <Flex mt="4" h="100%" flexGrow="1" maxHeight={{base: "calc(100vh -20px)", lg: "calc(100vh - 100px)"}}>
                <Flex
                  flexDir="column"
                  gap={6}
                  flexBasis="20%"
                  pt="4"
                  borderRight="solid 1px"
                  borderColor="neutral.dsGray"
                >
                  <Box textStyle="h6" color="neutral.black" fontWeight="400">
                    Profiles
                  </Box>
                  <Flex
                    flexDir="column"
                    w="100%"
                    h="100%"
                    overflow="hidden"
                    maxHeight="calc(100vh - 290px)"
                    position="relative"
                  >
                    <PerfectScrollbar
                      options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
                      style={{
                        width: '100%'
                      }}
                    >
                      <Flex flexDir="column" rowGap={2}>
                        {user && newChat && <ChatPreview 
                          id={'newChat'}
                          lastMessage={newChat.lastMessage?.content}
                          lastMessageDate={newChat.lastMessage?.createdAt ? new Date(newChat.lastMessage.createdAt) : undefined}
                          receiver={newChat.user1Type === 'User' && newChat.user1 === user?.wallet.toLowerCase() ? newChat.partnerCompany : newChat.partnerUser}
                          userType={newChat.user1Type === 'User' && newChat.user1 === user?.wallet.toLowerCase() ? 'Company' : 'User'}
                          isActive={activeChat === 'newChat'}
                              onClick={(id: string) => {
                                setActiveChat('newChat');
                              }}/>}
                        {user && chats && chats.map((v,k) => 
                        <ChatPreview 
                          key={k} id={k.toString()}
                          lastMessage={v.lastMessage?.content}
                          lastMessageDate={v.lastMessage?.createdAt ? new Date(v.lastMessage.createdAt) : undefined}
                          receiver={getChatReceiver(v)}
                          userType={getChatReceiverUserType(v)}
                          isActive={activeChat === k.toString()}
                              onClick={(id: string) => {
                                setActiveChat(id);
                              }}/>)}
                      </Flex>
                    </PerfectScrollbar>
                  </Flex>
                </Flex>
                <Flex flexDir="column" gap={6} flexBasis="80%">
                  {activeChat && chats && (
                    <ChatMessages
                      id={activeChat}
                      chat={activeChat === 'newChat' ? newChat : chats[parseInt(activeChat)]}
                      isNewChat={activeChat === 'newChat'}
                      onNewChatMessage={() => {setTimeout(() => {setNewChat(undefined); setActiveChat('0');}, 5000)}}
                    />
                  )}
                </Flex>
              </Flex>}
              {!fetching && (mobileDisplay || tabletDisplay) && <Flex mt="4" h="100%" flexGrow="1" maxHeight="calc(100vh - 100px)">
              {!chatOpen && <Flex
                    flexDir="column"
                    w="100%"
                    h="100%"
                    overflow="hidden"
                    maxHeight="calc(100vh - 290px)"
                    position="relative"
                    px={{base: 2, lg: 0}}
                  >
                    <PerfectScrollbar
                      options={{ suppressScrollX: true, maxScrollbarLength: 160 }}
                      style={{
                        width: '100%'
                      }}
                    >
                      <Flex flexDir="column" rowGap={2}>
                        {user && newChat && <ChatPreview 
                          id={'newChat'}
                          lastMessage={newChat.lastMessage?.content}
                          lastMessageDate={newChat.lastMessage?.createdAt ? new Date(newChat.lastMessage.createdAt) : undefined}
                          receiver={newChat.user1Type === 'User' && newChat.user1 === user?.wallet.toLowerCase() ? newChat.partnerCompany : newChat.partnerUser}
                          userType={newChat.user1Type === 'User' && newChat.user1 === user?.wallet.toLowerCase() ? 'Company' : 'User'}
                          isActive={activeChat === 'newChat'}
                              onClick={(id: string) => {
                                setActiveChat('newChat');
                                setChatOpen(true);
                              }}/>}
                        {user && chats && chats.map((v,k) => 
                        <ChatPreview 
                          key={k} id={k.toString()}
                          lastMessage={v.lastMessage?.content}
                          lastMessageDate={v.lastMessage?.createdAt ? new Date(v.lastMessage.createdAt) : undefined}
                          receiver={getChatReceiver(v)}
                          userType={getChatReceiverUserType(v)}
                          isActive={activeChat === k.toString()}
                              onClick={(id: string) => {
                                setActiveChat(id);
                                setChatOpen(true);
                              }}/>)}
                      </Flex>
                    </PerfectScrollbar>
                  </Flex>}
              {chatOpen &&    <Flex flexDir="column" gap={6} flexBasis="100%">
                  {activeChat && chats && (
                    <ChatMessages
                      id={activeChat}
                      chat={activeChat === 'newChat' ? newChat : chats[parseInt(activeChat)]}
                      isNewChat={activeChat === 'newChat'}
                      onNewChatMessage={() => {setTimeout(() => {setNewChat(undefined); setActiveChat('0');}, 5000)}}
                    />
                  )}
                </Flex>}
                </Flex>}
              {fetching &&  <Flex
                flexDir="column"
                justifyContent="center"
                alignItems="center"
                my={16}
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%;-50%)"
              >
                <Spinner color="brand.primary" size="xl" mx="auto" />
                <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
                  Loading Messages
                </Box>
              </Flex>}
            </Flex>
          </MotionBox>
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardChat;
