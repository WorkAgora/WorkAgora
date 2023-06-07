import { Box, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { UserTypeEnum } from '@workagora/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

const MotionBox = motion(Box);

const DashboardContracts: FC = () => {
  const { type } = useLanding();

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Flex px={{base: 0, lg: 6}} flexDir="column" w="100%" h="100%" minH="calc( 100vh - 80px )">
      <Flex
        flexDir="column"
        w="100%"
        flexGrow="1"
        bgColor="neutral.white"
        px={{base: 4, lg: 8}}
        py={{base: 2, lg: 6}}
        gap={{base: 4, lg: 8}}
        borderRadius={{base: '32px', lg: "64px"}}
      >
        <AnimatePresence mode="wait">
          {type === UserTypeEnum.Freelancer && (
            <MotionBox
              key="freelance"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <Flex flexDir="column" gap={4}>
                <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                  My Contracts
                </Box>
                <Flex flexDir="column" gap={6}>
                <Box
                    textStyle="body2"
                    as="span"
                    textAlign="center"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  >
                    No contracts available | Feature coming soon
                  </Box>
                </Flex>
              </Flex>
            </MotionBox>
          )}
          {type === UserTypeEnum.Company && (
            <MotionBox
              key="company"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            >
              <Flex flexDir="column" gap={4}>
                <Box textStyle="h2" as="h1" w="100%" textAlign="left">
                  My Contracts
                </Box>
                <Flex flexDir="column" gap={6}>
                <Box
                    textStyle="body2"
                    as="span"
                    textAlign="center"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  >
                    No contracts available | Feature coming soon
                  </Box>
                </Flex>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default DashboardContracts;
