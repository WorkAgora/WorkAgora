import { Box, Divider, Flex } from '@chakra-ui/react';
import { useCurrentCompany, useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChatPreview from './ChatPreview';
import ChatMessages from './ChatMessages';

const MotionBox = motion(Box);

const DashboardChat: FC = () => {
  const { type } = useLanding();
  const { user } = useCurrentUser();
  const { company } = useCurrentCompany();
  const [activeChat, setActiveChat] = useState('0');

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

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
              <Flex mt="4" h="100%" flexGrow="1" maxHeight="calc(100vh - 100px)">
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
                        {user &&
                          Array.from({ length: 20 }).map((_, k) => (
                            <ChatPreview
                              key={k}
                              id={k.toString()}
                              receiver={company}
                              userType="Company"
                              isActive={activeChat === k.toString()}
                              onClick={(id: string) => {
                                console.log(id);
                              }}
                              lastMessage=""
                              lastMessageDate={new Date()}
                            />
                          ))}
                      </Flex>
                    </PerfectScrollbar>
                  </Flex>
                </Flex>
                <Flex flexDir="column" gap={6} flexBasis="80%">
                  {activeChat && (
                    <ChatMessages
                      id={activeChat}
                      receiver={company}
                      userType="Company"
                      sender={user}
                    />
                  )}
                </Flex>
              </Flex>
            </Flex>
          </MotionBox>
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardChat;
