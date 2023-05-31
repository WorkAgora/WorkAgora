import { Box, Flex } from '@chakra-ui/react';
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);

const DashboardChat: FC = () => {
  const { type } = useLanding();
  const { user } = useCurrentUser();

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
          >
            <Flex flexDir="column" gap={4}>
              <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                Messages
              </Box>
              <Flex mt="8">
                <Flex flexDir="column" gap={6} flexBasis="20%">
                  <Box textStyle="h6" color="neutral.black" fontWeight="400">
                    Profiles
                  </Box>
                </Flex>
                <Flex flexDir="column" gap={6} flexBasis="80%"></Flex>
              </Flex>
            </Flex>
          </MotionBox>
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardChat;
