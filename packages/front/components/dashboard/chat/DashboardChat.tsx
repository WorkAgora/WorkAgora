import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useChatInstance, useCurrentCompany, useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChatPreview from './ChatPreview';
import ChatMessages from './ChatMessages';
import { useRouter } from 'next/router';
import { useGetJobById } from '@workagora/front/hooks/useGetJobById';
import { ChatAuthorType, UserTypeEnum } from '@workagora/utils';
import { useGetMyChats } from '@workagora/front/hooks/useGetMyChats';

const MotionBox = motion(Box);

const DashboardChat: FC = () => {
  const { type } = useLanding();
  const { user } = useCurrentUser();
  const { company } = useCurrentCompany();
  const [activeChat, setActiveChat] = useState('');
  const {curJob, getJobById, loading} = useGetJobById();
  const {fetching, chats, addNewChat} = useChatInstance();
  const { query } = useRouter();
  useGetMyChats();

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  useEffect(() => {
    if (query && query.job && type === UserTypeEnum.Freelancer) {
      getJobById(query.job as string)
    }
  },[getJobById, query, type])

  useEffect(() => {
    if (query && query.job && type === UserTypeEnum.Freelancer && curJob && user && curJob.company?.companyWallet && !fetching) {
      if (!chats || (chats && !chats.find((v) => v.partnerWallet === curJob.company?.companyWallet))) {
        const chatId = addNewChat({
          PK: '',
          SK: '',
          myWallet: user?.wallet,
          partnerWallet: curJob.company?.companyWallet,
          partnerType: ChatAuthorType.Company,
          partnerCompany: curJob.company,
          visible: true
        });
        setActiveChat(chatId.toString());
      }
    }
  }, [curJob, query, type, user])

  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        maxHeight="calc(100vh - 100px)"
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={8}
        mb={6}
        borderRadius="64px"
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
            maxHeight="calc(100vh - 100px)"
          >
            <Flex flexDir="column" gap={4} flexGrow="1" maxHeight="calc(100vh - 100px)">
              <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                Messages
              </Box>
              {!fetching && <Flex mt="4" h="100%" flexGrow="1" maxHeight="calc(100vh - 100px)">
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
                        {user && chats && chats.map((v,k) => 
                        <ChatPreview 
                          key={k} id={k.toString()}
                          lastMessage={v.lastMessage?.content}
                          lastMessageDate={v.lastMessage?.createdAt ? new Date(v.lastMessage.createdAt) : undefined}
                          receiver={type === UserTypeEnum.Freelancer ? v.partnerCompany : v.partnerUser}
                          userType={v.partnerType}
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
                      chat={chats[parseInt(activeChat)]}
                    />
                  )}
                </Flex>
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
